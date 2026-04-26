import { useState, useEffect } from "react";
import {
  generatePassword,
  isStrongPassword,
  injectPasswordToPage,
} from "./passwordHelpers";

function App() {
  // --- States (ניהול זיכרון האפליקציה) ---
  const [currentPassword, setCurrentPassword] = useState(""); // שומר את הסיסמה שנוצרה

  // --- Handlers (הפונקציות שמגיבות ללחיצות כפתור) ---

  // פונקציה לייצור סיסמה חזקה
  const handleGenerateClick = () => {
    const newPass = generatePassword();
    // וולידציה - מוודאים שהסיסמה באמת חזקה לפני שמציגים אותה
    if (isStrongPassword(newPass)) {
      setCurrentPassword(newPass);
    } else {
      alert("שגיאה פנימית בייצור סיסמה, נסה שוב");
    }
  };

  // פונקציה להזרקת הסיסמה ישירות לשדה באתר
  const handleInjectClick = () => {
    if (!currentPassword) {
      alert("קודם תייצר סיסמה!");
      return;
    }
    injectPasswordToPage(currentPassword);
  };

  // --- UI (מה שהמשתמש רואה) ---
  return (
    <div
      style={{
        padding: "15px",
        textAlign: "center",
        width: "300px",
        fontFamily: "Arial",
        direction: "rtl",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: "5px" }}>Password Manager</h2>

      {/* תיבת הצגת הסיסמה */}
      <div
        style={{
          backgroundColor: "#f4f4f4",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "15px",
        }}
      >
        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#666" }}>
          סיסמה שנוצרה:
        </p>
        <strong
          style={{
            fontSize: "20px",
            letterSpacing: "2px",
            color: "#222",
            wordBreak: "break-all",
          }}
        >
          {currentPassword || "--------"}
        </strong>
      </div>

      {/* כפתורי פעולה */}
      <button
        onClick={handleGenerateClick}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        ייצר סיסמה חזקה
      </button>

      <button
        onClick={handleInjectClick}
        style={{
          backgroundColor: "#2196F3",
          color: "white",
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        הזרק סיסמה לדף
      </button>

      <p style={{ fontSize: "10px", marginTop: "15px", color: "#999" }}>
        * הסיסמה תישמר אוטומטית בשרת בעת לחיצה על כפתור התחברות באתר.
      </p>
    </div>
  );
}

export default App;
