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
  PASSWORD_GENERATION_ERROR: {
  message: "Failed to generate a strong password. Please try again.",
  icon: "⚠️",
  type: "error",
  },
  NO_PASSWORD_GENERATED: {
  message: "Please generate a password first.",
  icon: "⚠️",
  type: "warning",
  },
  PASSWORD_COPIED: {
  message: "Password copied to clipboard",
  icon: "✓",
  type: "success",
  },
  USERNAME_COPIED: {
  message: "Username copied to clipboard",
  icon: "✓",
  type: "success",
  },
  INVALID_MASTER_PASSWORD: {
  message: "Incorrect master password. Please try again.",
  icon: "✕",
  type: "error",
  },
  REGISTRATION_FAILED: {
  message: "Registration failed. The email may already be in use, or the server is unavailable.",
  icon: "✕",
  type: "error",
  },
};


export function useNotification() {
  const [notification, setNotification] = useState({
    message: "",
    icon: "",
    type: "info",
  });

  /*  Close the current popup  */ 
  const hideNotification = useCallback(() => {
    setNotification({ message: "", icon: "", type: "info" });
  }, []);

  /*Display popup by it's key*/ 
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