import { useState, useEffect } from "react";
import TextField from "../../../components/TextField/TextField";
import Button from "../../../components/Button/Button";
import { isStrongPassword, generatePassword } from "../../../passwordHelpers";
import PasswordRequirements from "../PasswordRequirements/PasswordRequirements";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import "./MasterPassword.css";


/* 
  Step 3 of the registration flow.
*/
function MasterPassword({ onSubmit, onBack, isLoading }) {

  /* ============================================================
     SECTION 1: STATE
     ============================================================ */

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  /* ============================================================
     SECTION 2: AUTO-GENERATE PASSWORD ON MOUNT
     ============================================================ */

  useEffect(() => {
    setPassword(generatePassword());
  }, []);


  /* ============================================================
     SECTION 3: ACTIONS - Generate / Clear
     ============================================================ */

  /* Generate a new random password and put it in the field. */
  const generateNewPassword = () => {
    setPassword(generatePassword());
  };

  /* Clear the password field so the user can type their own from scratch. */
  const clearPassword = () => {
    setPassword("");
  };

  /* ============================================================
     SECTION 4: VALIDATION
     ============================================================ */

  /* What error message to show below the master password field.
     Empty string means no error to show. */
  const getPasswordError = () => {
    if (password.length === 0) return "";
    if (password.length < 8) return "Password must be exactly 8 characters";
    if (!isStrongPassword(password)) {
      return "Password must include all the requirements above";
    }
    return "";
  };

  /* What error message to show below the confirm password field. */
  const getConfirmError = () => {
    if (confirmPassword.length === 0) return "";
    if (confirmPassword !== password) return "Passwords don't match";
    return "";
  };

  /* Whether the Create Vault button should be enabled. */
  const canCreateVault =
    isStrongPassword(password) && password === confirmPassword;


  /* ============================================================
     SECTION 5: HANDLE PASSWORD INPUT
     ============================================================ */

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    /* Block any input beyond 8 characters */
    if (value.length <= 8) {
      setPassword(value);
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    if (value.length <= 8) {
      setConfirmPassword(value);
    }
  };

  /* ============================================================
     SECTION 6: SUBMIT
     ============================================================ */

  const handleSubmit = () => {
    if (!canCreateVault) return;
    onSubmit(password);
  };

  /* ============================================================
     SECTION 7: RENDER 
     ============================================================ */

  /* Compute these once per render for use in JSX */
  const passwordError = getPasswordError();
  const confirmError = getConfirmError();

  return (
    <>
      {/* ---------- TITLES ---------- */}
      <div className="register-titles">
        <h2 className="register-title">Create Master Password</h2>
        <p className="register-subtitle">
          This password will encrypt all your data
        </p>
      </div>

      {/* ---------- REQUIREMENTS BOX ---------- */}
      <PasswordRequirements password={password} />

      {/* ---------- MASTER PASSWORD FIELD ---------- */}
      <div className="master-password-field">
        <TextField
          label="Master Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter master password"
          value={password}
          onChange={handlePasswordChange}
          rightIcon={showPassword ? "🙈" : "👁"}
          onRightIconClick={() => setShowPassword(!showPassword)}
        />

        {/* Strength meter - hidden when password is empty */}
        <PasswordStrength password={password} />

        {/* Error message - shown only when there's an actual error */}
        {passwordError && (
          <p className="master-password-error">{passwordError}</p>
        )}

        {/* Generate / Clear actions */}
        <div className="master-password-actions">
          <button
            type="button"
            className="master-password-action-link"
            onClick={generateNewPassword}
          >
            Generate new
          </button>
          <button
            type="button"
            className="master-password-action-link"
            onClick={clearPassword}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ---------- CONFIRM PASSWORD FIELD ---------- */}
      <div className="master-password-field">
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm master password"
          value={confirmPassword}
          onChange={handleConfirmChange}
          rightIcon={showConfirmPassword ? "🙈" : "👁"}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        {confirmError && (
          <p className="master-password-error">{confirmError}</p>
        )}
      </div>

      {/* ---------- IMPORTANT WARNING ---------- */}
      <div className="master-password-warning">
        <strong>Important:</strong> Your master password cannot be recovered!
      </div>

      {/* ---------- BOTTOM NAVIGATION ---------- */}
      <div className="register-actions">
        <Button variant="secondary" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!canCreateVault || isLoading}
        >
          {isLoading ? "Creating..." : "Create Vault"}
        </Button>
      </div>
    </>
  );
}
export default MasterPassword;