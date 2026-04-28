import "./Notification.css";

/* הודעה קופצת עם אייקון וכפתור סגירה */ 
function Notification({ message, icon, type, onClose }) {
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