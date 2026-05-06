// src/passwordHelpers.js

export const generatePassword = () => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const all = lower + upper + numbers + symbols;

  let password = "";
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 0; i < 4; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

/*
  Check each password requirement individually.
*/
export const getPasswordRequirements = (password) => {
  return {
    isCorrectLength: password.length === 8,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

/*
  Strict validation - returns true only if ALL requirements are met.
*/
export const isStrongPassword = (password) => {
  const reqs = getPasswordRequirements(password);
  return (
    reqs.isCorrectLength &&
    reqs.hasLowerCase &&
    reqs.hasUpperCase &&
    reqs.hasNumber &&
    reqs.hasSymbol
  );
};

/*
  Calculate password strength score (0-4) for the visual strength meter.
*/
export const getPasswordStrength = (password) => {
  const reqs = getPasswordRequirements(password);
  let score = 0;
  if (reqs.hasLowerCase) score++;
  if (reqs.hasUpperCase) score++;
  if (reqs.hasNumber) score++;
  if (reqs.hasSymbol) score++;
  return score;
};

export const injectPasswordToPage = async (passwordToInject) => {
  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (pass) => {
        const passwordInput = document.querySelector('input[type="password"]');
        if (passwordInput) {
          passwordInput.value = pass;
          passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
          alert("Password injected successfully!");
        } else {
          alert("No password field was found on this page.");
        }
      },
      args: [passwordToInject],
    });
  } catch {
    alert("Failed to inject the password");
  }
};
