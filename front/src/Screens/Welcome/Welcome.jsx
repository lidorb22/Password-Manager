import "./Welcome.css";
import AuthHeader from "../../components/AuthHeader/AuthHeader";
import Button from "../../components/Button/Button";

/* Welcome screen - landing page with two action buttons */
function Welcome({ onCreateAccount, onSignIn }) {
  return (
    <div className="welcome-screen">
      {/* Top gradient header with title and subtitle */}
      <AuthHeader
        title="Password Manager"
        subtitle="Your secure vault for all credentials"
      />

      {/* Main content area */}
      <div className="welcome-content">
        <div className="welcome-titles">
          <h2 className="welcome-title">Welcome!</h2>
          <p className="welcome-subtitle">
          Get started with your secure vault
        </p>
        </div>

        {/* Action buttons */}
      <div className="welcome-actions">
        <Button variant="primary" fullWidth onClick={onCreateAccount}>
        {/* User with plus icon */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
        Create New Account
    </Button>
    <Button variant="secondary" fullWidth onClick={onSignIn}>
        {/* Login arrow icon */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        I Have an Account
    </Button>
</div>
    </div>

      {/* Footer with security badges */}
      <div className="welcome-footer">
        <div className="welcome-badge">
          <span className="welcome-badge-dot welcome-badge-success"></span>
          <span>End-to-end encrypted</span>
        </div>
        <div className="welcome-badge">
          <span className="welcome-badge-dot welcome-badge-purple"></span>
          <span>Zero-knowledge security</span>
        </div>
      </div>
    </div>
  );
}

export default Welcome;