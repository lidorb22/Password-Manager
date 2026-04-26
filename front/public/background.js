// ==========================================
// Password Manager - Background Script
// השליח שאחראי על התקשורת מול ה-Backend
// ==========================================

// פונקציה 1: ביצוע השליחה הפיזית לשרת דרך API
const postDataToServer = async (payload) => {
  try {
    const response = await fetch("http://localhost:3000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // שולחים את הנתונים שהגיעו מהדף
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log("Background: הנתונים נשמרו בשרת בהצלחה!");
    } else {
      console.error("Background: השרת החזיר שגיאה", response.status);
    }
  } catch (error) {
    console.error("Background: שגיאת תקשורת מול השרת", error);
  }
};

// פונקציה 2: האזנה להודעות שמגיעות מה-Content Script (המרגל)
const listenToMessages = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // בודק אם קיבלנו הודעה עם תגית לשמירת נתונים
    if (request.action === "SAVE_CREDENTIALS") {
      console.log("Background: קיבלתי חבילה מהדף, מעביר לשרת...", request.data);
      
      // מפעיל את פונקציית השליחה לשרת
      postDataToServer(request.data);
    }
  });
};

// הפעלת המאזין ברגע שהתוסף נדלק
listenToMessages();