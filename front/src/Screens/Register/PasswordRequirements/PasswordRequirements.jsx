import { getPasswordRequirements } from "../../../passwordHelpers";
import "./PasswordRequirements.css";

/*
  Password Requirements box - shown in the master password creation step.
  Displays a list of all rules with a live indicator that updates as the user types.
*/
function PasswordRequirements({ password }) {
  /* 
    Get all requirement states from the helper.
  */
  const reqs = getPasswordRequirements(password);

  /*
    Helper to render one requirement row.
  */
  const renderRequirement = (isMet, label) => (
    <li className={`requirement ${isMet ? "requirement-met" : ""}`}>
      <span className="requirement-icon">{isMet ? "✓" : "•"}</span>
      <span className="requirement-text">{label}</span>
    </li>
  );

  /*
    Requirment Box.
  */
  return (
    <div className="password-requirements">
      <h4 className="requirements-heading">Password Requirements:</h4>
      <ul className="requirements-list">
        {renderRequirement(reqs.isCorrectLength, "Exactly 8 characters long")}
        {renderRequirement(reqs.hasLowerCase, "A lowercase letter (a-z)")}
        {renderRequirement(reqs.hasUpperCase, "An uppercase letter (A-Z)")}
        {renderRequirement(reqs.hasNumber, "A number (0-9)")}
        {renderRequirement(reqs.hasSymbol, "A punctuation mark (!@#$%^&*)")}
      </ul>
    </div>
  );
}

export default PasswordRequirements;