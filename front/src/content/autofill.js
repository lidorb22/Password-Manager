import { showInPageNotification } from "./inPageNotification.js";

/*
  Content Script
  Runs on every web page (per manifest.json - matches "<all_urls>").
  Listens for autofill requests from the background script
  and tries to fill in username/password fields on the page.
*/

/*
  Find the username/email field on the page.
*/
function findUsernameField() {
  const selectors = [
    'input[autocomplete="username"]',
    'input[autocomplete="email"]',
    'input[type="email"]',
    'input[name="username"]',
    'input[name="user"]',
    'input[name="email"]',
    'input[id*="username" i]',
    'input[id*="email" i]',
  ];

  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field && isFieldVisible(field)) {
      return field;
    }
  }
  return null;
}

/*
  Find the password field on the page.
*/
function findPasswordField() {
  const selectors = [
    'input[autocomplete="current-password"]',
    'input[type="password"]',
    'input[name="password"]',
    'input[id*="password" i]',
  ];

  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field && isFieldVisible(field)) {
      return field;
    }
  }
  return null;
}

/*
  Check if an input is actually visible on the page.
*/
function isFieldVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
}

/*
  Try to find login fields, retrying for up to 2.5 seconds.
*/
async function findFieldsWithRetry(maxAttempts = 5, delayMs = 500) {
  for (let i = 0; i < maxAttempts; i++) {
    const usernameField = findUsernameField();
    const passwordField = findPasswordField();

    /* If found the password field, done. */
    if (passwordField) {
      return { usernameField, passwordField };
    }

    /* Wait before trying again */
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  /* Final attempt - return whatever was found */
  return {
    usernameField: findUsernameField(),
    passwordField: findPasswordField(),
  };
}


function fillField(field, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(field, value);

  /* Trigger events the same way a user typing would */
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
  field.focus();
}


async function autofillCredentials(username, password) {
  /* Try to find both fields, with retry for slow-loading forms */
  const { usernameField, passwordField } = await findFieldsWithRetry();

  /* No password field found. Cannot proceed. */
  if (!passwordField) {
    showInPageNotification(
      "Could not find a password field on this page",
      "✕",
      "error"
    );
    return {
      success: false,
      error: "No password field found on this page",
    };
  }

  /* Always fill the password*/
  fillField(passwordField, password);

  /* If username field is missing - warn but don't fail. */
  if (!usernameField) {
    showInPageNotification(
      "Password filled, but no username field was found. You may need to enter your username manually.",
      "⚠",
      "warning"
    );
    return {
      success: true,
      filledUsername: false,
      filledPassword: true,
    };
  }
  
  fillField(usernameField, username);
  showInPageNotification(
    "Login details filled in successfully",
    "✓",
    "success"
  );

  return {
    success: true,
    filledUsername: true,
    filledPassword: true,
  };
}

/*
  Listen for messages from the background script.
*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "autofill") {
    autofillCredentials(message.username, message.password).then((result) => {
      sendResponse(result);
    });
    return true;
  }
});