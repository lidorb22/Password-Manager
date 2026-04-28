import "./Button.css";

/* Reusable button component with primary/secondary variants */
function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
}) {
    /* Build className based on props */
  const className = `btn btn-${variant}${fullWidth ? " btn-full" : ""}`;

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;