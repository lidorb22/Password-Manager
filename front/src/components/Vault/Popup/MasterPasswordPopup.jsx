import { useState } from "react";
import Popup from "./Popup";
import TextField from "../../TextField/TextField";
import Button from "../../Button/Button";
import { loginUser, decryptPassword } from "../../../API/controller";
import "./MasterPasswordPopup.css";

/* Popup that asks for the master password to reveal an account's credentials.*/
function MasterPasswordPopup({
  isOpen,
  onClose,
  account,
  userEmail,
  userId,
  onSuccess,
}) {

  /* ============================================================
     SECTION 1: STATE
     ============================================================ */

  const [masterPassword, setMasterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  /* ============================================================
     SECTION 2: HANDLERS
     ============================================================ */

  /* Reset all the state - called when the popup closes. */
  const resetForm = () => {
    setMasterPassword("");
    setShowPassword(false);
    setErrorMessage("");
  };

  /* Handle Cancel / X / click-outside - clear and close. */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUnlock = async () => {
    /* Block if password is empty - the button should be disabled but just in case */
    if (!masterPassword.trim()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      /* Step 1: verify master password by calling login. If the password is wrong, this will throw an error. */
      await loginUser({ email: userEmail, password: masterPassword });

      /* Step 2: master password verified  */
      const decrypted = await decryptPassword(userId, account.password);

      /* Pass the decrypted password*/
      onSuccess(decrypted);
      resetForm();
    } catch (error) {
      console.error("Master password verification failed:", error);
      setErrorMessage("Incorrect master password");
    } finally {
      setIsLoading(false);
    }
  };

  /* Allow Enter key to submit the form when the input is focused */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && masterPassword.trim() && !isLoading) {
      handleUnlock();
    }
  };


  /* ============================================================
     SECTION 3: RENDER
     ============================================================ */

  /* Don't render if no account  */
  if (!account) return null;

  return (
    <Popup isOpen={isOpen} onClose={handleClose}>
      {/* ---------- HEADER ---------- */}
      <div className="master-password-header">
        <div className="master-password-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="master-password-title">Master Password Required</h2>
        <p className="master-password-subtitle">
          Enter your master password to view the password for{" "}
          <span className="master-password-site-name">{account.site}</span>
        </p>
      </div>

      {/* ---------- INPUT FIELD ---------- */}
      <div className="master-password-form">
        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="Enter master password"
          value={masterPassword}
          onChange={(e) => {
            setMasterPassword(e.target.value);
            /* Clear the error as the user starts typing again */
            if (errorMessage) setErrorMessage("");
          }}
          onKeyDown={handleKeyDown}
          rightIcon={showPassword ? "🙈" : "👁"}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        {/* Inline error message - red text below the field */}
        {errorMessage && (
          <p className="master-password-error">{errorMessage}</p>
        )}
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div className="master-password-actions">
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUnlock}
          disabled={!masterPassword.trim() || isLoading}
        >
          {isLoading ? "Verifying..." : "Unlock"}
        </Button>
      </div>



    </Popup>
  );
}

export default MasterPasswordPopup;