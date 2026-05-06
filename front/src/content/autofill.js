import { showInPageNotification } from "./inPageNotification.js";
import "./inPageNotification.css";

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
    "value",
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
      "error",
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
      "warning",
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
    "success",
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

async function extractData() {
  // מחפש את כל ה-inputs בדף
  const inputs = document.querySelectorAll("input");
  let data = {
    site: window.location.hostname,
    link: window.location.href,
    username: "",
    password: "",
  };

  inputs.forEach((input) => {
    // אם זה שדה סיסמה
    if (input.type === "password") {
      data.password = input.value;
      // מנסה למצוא את השם משתמש שלפניו
      const prevInput = input
        .closest("form")
        ?.querySelector('input[type="text"], input[type="email"]');
      if (prevInput) data.username = prevInput.value;
    }
  });

  // אם לא מצאנו דרך ה-form, ניקח כל מה שיש בשדות הטקסט
  if (!data.username) {
    const emailInput = document.querySelector(
      'input[type="text"], input[type="email"]',
    );
    if (emailInput) data.username = emailInput.value;
  }

  if (data.username || data.password) {
    chrome.runtime.sendMessage({ action: "SAVE_CREDENTIALS", data: data });
  }
}

// מאזין לכל לחיצה על כפתור התחברות
document.addEventListener(
  "click",
  (e) => {
    const target = e.target;
    // מחפש לחיצה על כפתור או משהו שמתנהג כמו כפתור
    if (
      target.closest("button") ||
      target.closest('[role="button"]') ||
      target.closest('input[type="submit"]')
    ) {
      extractData();
    }
  },
  true,
);
