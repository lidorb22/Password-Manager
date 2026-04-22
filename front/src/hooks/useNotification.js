import { useState, useCallback } from "react";

/* הודעות מערכת בפורמט הבא: טקסט , אייקון, סוג*/ 
const NOTIFICATIONS = {
  REGISTRATION_SUCCESS: {
    message: "Registration was Successful",
    icon: "🎉",
    type: "success",
  },
  LOGIN_SUCCESS: {
    message: "Login was successful",
    icon: "✓",
    type: "success",
  },
  WRONG_CREDENTIALS: {
    message: "One or more details are incorrect. Please try again.",
    icon: "✕",
    type: "error",
  },
  PASSWORD_SAVED: {
    message:
      "New login information was successfully saved to the Password Manager",
    icon: "🎉",
    type: "success",
  },
  SERVER_ERROR: {
    message:
      "There was an error trying to connect to the server. Please check your Internet connection and try again",
    icon: "⚠️",
    type: "warning",
  },
};


export function useNotification() {
  /* הודעה שמוצגת כרגע (אם יש)*/
  const [notification, setNotification] = useState({
    message: "",
    icon: "",
    type: "info",
  });

  /*  סגירת ההודעה הנוכחית  */ 
  const hideNotification = useCallback(() => {
    setNotification({ message: "", icon: "", type: "info" });
  }, []);

  /*הצגת הודעה לפי המפתח שלה */ 
  const showNotification = useCallback((key) => {
    const notif = NOTIFICATIONS[key];
    if (notif) setNotification(notif);
  }, []);

  return {
    notification,
    hideNotification,
    showNotification,
  };
}