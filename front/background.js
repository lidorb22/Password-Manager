import { createAccount } from "./src/API/controller";

// ==========================================
// Password Manager - Background Script
// השליח שאחראי על התקשורת מול ה-Backend
// ==========================================

// פונקציה 1: ביצוע השליחה הפיזית לשרת דרך API
//need to change the id to be dynamic and not hardcoded
const postDataToServer = async (payload) => {
  createAccount({ ...payload, id: "69e50c2ca817c005c511e802" });
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
