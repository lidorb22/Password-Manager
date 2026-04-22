import { useState } from "react";
import Notification from "./components/Notification";
import { useNotification } from "./hooks/useNotification";

function App() {
  const [serverData, setServerData] = useState("טוען נתונים...");
  /* ניהול הודעות קופצות */
  const { notification, hideNotification, showNotification } = useNotification();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/data");
      const data = await response.json();
      setServerData(data.message);
    } catch (error) {
      setServerData("שגיאה בחיבור לשרת");
      console.error(error);
      /* הצגת הודעת שגיאת שרת למשתמש */
      showNotification("SERVER_ERROR");
    }
  };

  /* 
    פונקציית הפניה ומילוי אוטומטי  
    שולחת הודעה ל-Background Script שיפתח את האתר וימלא את הפרטים
    צריכה להיקרא ע"י פונקציית רשימת הסיסמאות   */
  // eslint-disable-next-line no-unused-vars
  const redirectAndAutofill = async (link, username, password) => {
    try {
      await chrome.runtime.sendMessage({
        action: "redirectAndAutofill",
        link,
        username,
        password,
      });
    } catch (error) {
      console.error("Message error:", error);
      showNotification("SERVER_ERROR");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* ההודעה הקופצת - מופיעה בראש המסך כשיש הודעה פעילה */}
      <Notification
        message={notification.message}
        icon={notification.icon}
        type={notification.type}
        onClose={hideNotification}
      />

      <h1>Password Manager</h1>
      <div className="card">
        <p>
          תגובה מהשרת: <strong>{serverData}</strong>
        </p>
        <button onClick={fetchData}>משוך נתונים עכשיו</button>
      </div>
    </div>
  );
}

export default App;