import { showInPageNotification } from "./inPageNotification.js";
/*Content Script*/

/*חיפוש שדה משתמש בדף*/
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
    'input[type="text"]',
  ];

  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field && isFieldVisible(field)) {
      return field;
    }
  }
  return null;
}

/*חיפוש שדה סיסמא בדף */
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

/*בדיקה האם יש שדות נסתרים שצריך למלא */
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

/*מילוי ערך בשדה */
function fillField(field, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(field, value);

  /*גורמים לאתר לחשוב שהמשתמש ממלא את השדה ידנית*/
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
  field.focus();
}

/*מילוי שני השדות : משתמש וסיסמא*/
function autofillCredentials(username, password) {
  const usernameField = findUsernameField();
  const passwordField = findPasswordField();

  /*אם לא נמצאו שדות התחברות - מציג הודעת שגיאה בדף עצמו*/
  if (!usernameField && !passwordField) {
    showInPageNotification(
      "One or more details are incorrect. Please try again.",
      "✕",
      "error"
    );
    return {
      success: false,
      error: "No login fields were found on this page",
    };
  }

  if (usernameField) {
    fillField(usernameField, username);
  }

  if (passwordField) {
    fillField(passwordField, password);
  }

  /*הצגת הודעת הצלחה בדף עצמו*/
  showInPageNotification("Login was successful", "✓", "success");

  return {
    success: true,
    filledUsername: !!usernameField,
    filledPassword: !!passwordField,
  };
}

/*Catching messages from the Background Script*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "autofill") {
    const result = autofillCredentials(message.username, message.password);
    sendResponse(result);
  }
  return true; // חייב להחזיר true כדי שההודעה תישלח חזרה בצורה אסינכרונית
}); 