import Popup from "./Popup";
import Button from "../../Button/Button";
import "./CredentialsPopup.css";

/* Popup that displays decrypted credentials for an account.*/
function CredentialsPopup({
  isOpen,
  onClose,
  account,
  decryptedPassword,
  showNotification,
}) {

  /* ============================================================
     SECTION 1: HANDLERS
     ============================================================ */

  /*Copy a value to clipboard. Used for both username and password copy buttons.*/
  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification(label === "password" ? "PASSWORD_COPIED" : "USERNAME_COPIED");
    } catch (error) {
      console.error("Copy failed:", error);
      showNotification("SERVER_ERROR");
    }
  };

  /* Open the website in a new tab and autofill the credentials.*/
const handleGoToWebsite = async () => {
  /* Build the URL - add https:// if missing so window.open doesn't treat it as relative */
  const url = account.link.startsWith("http")
    ? account.link
    : `https://${account.link}`;

  try {
    /* Detect if we're running as a Chrome extension */
    
    if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      /* Extension mode - send to background script for autofill */
      await chrome.runtime.sendMessage({
        action: "redirectAndAutofill",
        link: account.link,
        username: account.username,
        password: decryptedPassword,
      });
     
    } else {
        
      /* Dev mode - just open the URL in a new tab (no autofill) */
      console.log("dev?");
      window.open(url, "_blank", "noopener,noreferrer");
    }
    /* Close the popup after triggering the redirect */
    onClose();
  } catch (error) {
    console.error("Redirect failed:", error);
    showNotification("SERVER_ERROR");
  }
};


  /* ============================================================
     SECTION 2: RENDER
     ============================================================ */

  /* Safety check - don't render if account or password is missing */
  if (!account || !decryptedPassword) return null;

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      {/* ---------- HEADER ---------- */}
      <div className="credentials-header">
        {/* Green checkmark icon - signals successful unlock */}
        <div className="credentials-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 12 15 16 10" />
          </svg>
        </div>
        <h2 className="credentials-title">{account.site}</h2>
        <p className="credentials-subtitle">Your credentials</p>
      </div>

        {/* ---------- USERNAME BOX ---------- */}
      <div className="credentials-field">
        <span className="credentials-field-label">Username</span>
        <span className="credentials-field-value">{account.username}</span>
        <button
          type="button"
          className="credentials-field-copy"
          onClick={() => handleCopy(account.username, "username")}
          title="Copy username"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>

      {/* ---------- PASSWORD BOX ---------- */}
      <div className="credentials-field credentials-field-password">
        <span className="credentials-field-label">Password</span>
        <span className="credentials-field-value credentials-field-mono">
          {decryptedPassword}
        </span>
        <button
          type="button"
          className="credentials-field-copy"
          onClick={() => handleCopy(decryptedPassword, "password")}
          title="Copy password"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div className="credentials-actions">
        {/* Primary action - go to website with autofill */}
        <Button variant="primary" onClick={handleGoToWebsite}>
          <span className="credentials-go-button-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Go to Website
          </span>
        </Button>

        {/* Secondary action - close the popup */}
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Popup>
  );
}

export default CredentialsPopup;