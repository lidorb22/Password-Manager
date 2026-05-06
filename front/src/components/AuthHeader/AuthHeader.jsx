import "./AuthHeader.css";

/* Gradient header for authentication screens (welcome/login/register) */
function AuthHeader({ title, subtitle, icon = "shield", onBack }) {
  return (
    <div className="auth-header">
      {/* Back button - shown only if onBack handler provided */}
      {onBack && (
        <button className="auth-header-back" onClick={onBack} type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      )}

      {/* Icon in a circle - shield by default, lock for login */}
      <div className="auth-header-icon">
        {icon === "shield" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        )}
        {icon === "lock" && (
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
        )}
      </div>

      {/* Main title and subtitle */}
      <h1 className="auth-header-title">{title}</h1>
      <p className="auth-header-subtitle">{subtitle}</p>
    </div>
  );
}

export default AuthHeader;