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

  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export const isStrongPassword = (password) => {
  if (password.length !== 8) return false;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasLowerCase && hasUpperCase && hasNumber && hasSymbol;
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
          passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
          alert("הסיסמה הוזרקה בהצלחה!");
        } else {
          alert("לא נמצא שדה סיסמה בדף הזה.");
        }
      },
      args: [passwordToInject],
    });
  } catch (error) {
    console.error("שגיאה בהזרקת הסיסמה:", error);
  }
};