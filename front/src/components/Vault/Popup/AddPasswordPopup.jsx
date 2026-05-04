import { useState } from "react";
import Popup from "./Popup";
import TextField from "../../TextField/TextField";
import Button from "../../Button/Button";
import { createAccount } from "../../../API/controller";
import "./AddPasswordPopup.css";

/* Popup for adding a new password to the vault.*/
function AddPasswordPopup({
  isOpen,
  onClose,
  userId,
  onAccountAdded,
  showNotification,
}) {

  /* ============================================================
     SECTION 1: STATE
     ============================================================ */

  const [site, setSite] = useState("");
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  /* ============================================================
     SECTION 2: VALIDATION
     ============================================================ */

  /* All fields are required - the Add button is disabled until they're filled. */
  const canSubmit =
    site.trim() &&
    link.trim() &&
    username.trim() &&
    password.trim();


  /* ============================================================
     SECTION 3: HANDLERS
     ============================================================ */

  /* Reset all the fields - called when the popup closes. */
  const resetForm = () => {
    setSite("");
    setLink("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
  };

  /* Handle Cancel / X / click-outside - clear the form and close. */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /* Handle the Add Password button click - save to the server. */
  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      /* Send to the server - returns the updated user with the new account. */
      const updatedUser = await createAccount({
        id: userId,
        site,
        link,
        username,
        password,
      });
      showNotification("PASSWORD_SAVED");
      onAccountAdded(updatedUser);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to add password:", error);
      showNotification("SERVER_ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  /* ============================================================
     SECTION 4: RENDER
     ============================================================ */

  return (
    <Popup isOpen={isOpen} onClose={handleClose}>
      {/* ---------- HEADER ---------- */}
      <div className="add-password-header">
        <div className="add-password-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <h2 className="add-password-title">Add New Password</h2>
        <p className="add-password-subtitle">Save a new account to your vault</p>
      </div>

      {/* ---------- FORM FIELDS ---------- */}
      <div className="add-password-form">
        <TextField
          label="Website Name *"
          placeholder="e.g., GitHub, Gmail"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />

        <div>
          <TextField
            label="Website URL *"
            placeholder="e.g., github.com or https://github.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <p className="add-password-helper">Enter the website address</p>
        </div>

        <TextField
          label="Username/Email *"
          placeholder="your.username@email.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password *"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightIcon={showPassword ? "🙈" : "👁"}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />
      </div>

      

      {/* ---------- ACTION BUTTONS ---------- */}
      <div className="add-password-actions">
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? "Saving..." : "Add Password"}
        </Button>
      </div>
    </Popup>
  );
}

export default AddPasswordPopup;