import { useEffect } from "react";
import "./Notification.css";

/* Pop-up notification with icon and close button.
   Auto-dismisses after 8 seconds. */
function Notification({ message, icon, type, onClose }) {
  /* Auto-dismiss timer - runs whenever a new message appears.
     Cleans up the previous timer if a new notification comes in. */
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    /* Cleanup - cancel the timer if the component unmounts
       or if message/onClose changes before the timer fires. */
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-icon">{icon}</span>
      <span className="notification-message">{message}</span>
      <button
        className="notification-close"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}

export default Notification;