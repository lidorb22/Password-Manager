import "./Popup.css";

function Popup({ isOpen, onClose, children }) {
  /* If the popup is closed, render nothing. */
  if (!isOpen) return null;

  /* Click handler for the backdrop.*/
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-backdrop" onClick={handleBackdropClick}>
      <div className="popup-box">
        {/* Close button in the top-right corner */}
        <button
          className="popup-close"
          onClick={onClose}
          type="button"
          title="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* The actual popup content.*/}
        {children}
      </div>
    </div>
  );
}

export default Popup;