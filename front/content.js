console.log("Password Manager: גירסת הזרקה אגרסיבית פעילה!");

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
