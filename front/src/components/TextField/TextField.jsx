import "./TextField.css";

/*
  Reusable text field component
  Supports: label, optional icon (left), optional clickable icon (right), error state
*/
function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  rightIcon,
  onRightIconClick,
}) {
  return (
    <div className="textfield">
      {/* Label shown only if provided */}
      {label && <label className="textfield-label">{label}</label>}

      {/* Gets error class if validation failed */}
      <div className={`textfield-wrapper${error ? " textfield-error" : ""}`}>
        {/* Left icon - optional */}
        {icon && <span className="textfield-icon">{icon}</span>}

        {/* Main input field */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="textfield-input"
        />

        {/* Right icon as a clickable button (show/hide password) */}
        {rightIcon && (
          <button
            type="button"
            className="textfield-right-icon"
            onClick={onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>

      {/* Error message - shown below the field */}
      {error && <span className="textfield-error-message">{error}</span>}
    </div>
  );
}

export default TextField;