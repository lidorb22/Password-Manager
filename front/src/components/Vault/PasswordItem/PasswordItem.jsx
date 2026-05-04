import "./PasswordItem.css";

/* Helper - extract clean domain from URL.*/
const extractDomain = (link) => {
  if (!link) return "";
  /* Strip protocol (http://, https://) */
  let domain = link.replace(/^https?:\/\//, "");
  /* Strip www. prefix */
  domain = domain.replace(/^www\./, "");
  /* Strip path - keep only the domain part */
  domain = domain.split("/")[0];
  return domain;
};

/* Build favicon URL using Google's free favicon service.*/
const getFaviconUrl = (link) => {
  const domain = extractDomain(link);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

/* Single password row in the list. Shows only the site name and the favicon.*/
function PasswordItem({ account, isShared, onView }) {
  return (
    <div className="password-item">
      {/* Favicon container - rotates on hover via CSS */}
      <div className="password-item-icon">
        <img
          src={getFaviconUrl(account.link)}
          alt={account.site}
          /* Fallback - if favicon fails to load, show first letter instead */
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        {/* Fallback letter - hidden by default, shown only if image fails */}
        <div className="password-item-icon-fallback">
          {account.site.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Site name + warning indicator */}
      <div className="password-item-info">
        <span className="password-item-site">{account.site}</span>

        {/* Warning triangle - shown only if password is reused */}
        {isShared && (
          <span
            className="password-item-warning"
            title="This password is used for multiple accounts"
          >
            ⚠️
          </span>
        )}
      </div>

      {/* Right section - eye button to view credentials */}
      <button
        className="password-item-action"
        onClick={() => onView(account)}
        type="button"
        title="View credentials"
      >
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
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
  );
}

export default PasswordItem;