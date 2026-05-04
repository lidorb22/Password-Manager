import { getPasswordStrength } from "../../../passwordHelpers";
import "./PasswordStrength.css";

/*
  Password strength meter - 4 horizontal bars + label.
  The bars fill up and change color based on how many character types
  the password contains.
*/
function PasswordStrength({ password }) {
  /* 
    Calculate the strength score (0-4).
  */
  const score = getPasswordStrength(password);

  /*
    Get the label and the color class based on the score.
  */
  const getStrengthInfo = (score) => {
    if (score <= 2) return { label: "Weak", className: "strength-weak" };
    if (score === 3) return { label: "Fair", className: "strength-fair" };
    return { label: "Strong", className: "strength-strong" };
  };

  const { label, className } = getStrengthInfo(score);

  /* Don't show anything when password is empty */
  if (password.length === 0) {
    return null;
  }

  return (
    <div className="password-strength">
      {/* The 4 bars - filled up to the current score */}
      <div className="strength-bars">
        {[1, 2, 3, 4].map((barNumber) => (
          <div
            key={barNumber}
            className={`strength-bar ${
              barNumber <= score ? `strength-bar-filled ${className}` : ""
            }`}
          />
        ))}
      </div>

      {/* The text label below the bars */}
      <span className={`strength-label ${className}`}>{label}</span>
    </div>
  );
}

export default PasswordStrength;