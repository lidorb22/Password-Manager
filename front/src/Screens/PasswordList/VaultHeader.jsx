import "./VaultHeader.css";

/*
  Vault screen header 
*/
function VaultHeader({ firstname, onAddClick }) {
  return (
    <div className="vault-header">
      {/* Left side: lock icon + greeting text */}
      <div className="vault-header-left">
        {/* Lock icon */}
        <div className="vault-header-icon">
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

        {/* Greeting text */}
        <div className="vault-header-text">
          <h1 className="vault-header-title">Hello, {firstname}!</h1>
          <p className="vault-header-subtitle">Password Manager</p>
        </div>
      </div>

      {/* Right side: + button to add a new password */}
      <button
        className="vault-header-add"
        onClick={onAddClick}
        type="button"
        title="Add new password"
      >
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
      </button>
    </div>
  );
}

export default VaultHeader;