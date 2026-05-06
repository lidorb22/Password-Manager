import { useState } from "react";
import VaultHeader from "./VaultHeader";
import PasswordItem from "../../components/Vault/PasswordItem/PasswordItem";
import AddPasswordPopup from "../../components/Vault/Popup/AddPasswordPopup";
import MasterPasswordPopup from "../../components/Vault/Popup/MasterPasswordPopup";
import CredentialsPopup from "../../components/Vault/Popup/CredentialsPopup";
import "./PasswordList.css";

/* Main vault screen - shows the user's saved passwords.*/
function PasswordList({ user, setUser, showNotification }) {
  /* ============================================================
     SECTION 1: STATE
     ============================================================ */

  /* The current search query - filters the visible accounts */
  const [searchQuery, setSearchQuery] = useState("");

  /* Whether the Add Password popup is open */
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  /* The account whose credentials are being viewed.
     null = no view in progress. Set when user clicks the eye icon. */
  const [selectedAccount, setSelectedAccount] = useState(null);

  /* The decrypted password (set after master password verification).
     null = master password popup is showing.
     non-null = credentials popup is showing. */
  const [decryptedPassword, setDecryptedPassword] = useState(null);


  /* ============================================================
     SECTION 2: DERIVED DATA
     ============================================================ */

  /* If there's no search query, show all accounts. Otherwise filter by site name.*/
  const filteredAccounts = user.accounts.filter((account) => {
    if (!searchQuery) return true;
    return account.site.toLowerCase().includes(searchQuery.toLowerCase());
  });

  /* Detect "shared" passwords - same encrypted password used in multiple accounts. */
  const sharedPasswordSet = new Set();
  const seenPasswords = new Set();
  user.accounts.forEach((acc) => {
    if (seenPasswords.has(acc.password)) {
      sharedPasswordSet.add(acc.password);
    }
    seenPasswords.add(acc.password);
  });


  /* ============================================================
     SECTION 3: ACTION HANDLERS
     ============================================================ */

  /* Triggered by the + button in VaultHeader. Opens the Add Password popup. */
  const handleAddClick = () => {
    setIsAddPopupOpen(true);
  };

  /* Called by AddPasswordPopup after a successful save.  */
  const handleAccountAdded = (updatedUser) => {
    setUser(updatedUser);
  };

  /* Triggered by the eye icon in PasswordItem. */
  const handleViewPassword = (account) => {
    setSelectedAccount(account);
    /* decryptedPassword stays null until master password is verified */
    setDecryptedPassword(null);
  };

  /* Called by MasterPasswordPopup when the user enters the correct master password. */
  const handleMasterPasswordVerified = (decrypted) => {
    setDecryptedPassword(decrypted);
  };

  /* Close any open viewing flow. */
  const handleCloseViewing = () => {
    setSelectedAccount(null);
    setDecryptedPassword(null);
  };


  /* ============================================================
     SECTION 4: RENDER
     ============================================================ */

  return (
    <div className="passwords-list-screen">

      {/* ---------- HEADER ---------- */}
      <VaultHeader
        firstname={user.firstname}
        onAddClick={handleAddClick}
      />

      {/* ---------- CONTENT ---------- */}
      <div className="passwords-list-content">

        {/* Search input */}
        <div className="passwords-list-search">
          <svg
            className="passwords-list-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="passwords-list-search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Account list */}
        <div className="passwords-list-items">
          {filteredAccounts.length === 0 ? (
            <div className="passwords-list-empty">
              {user.accounts.length === 0
                ? "No passwords saved yet. Click + to add your first one."
                : "No accounts match your search."}
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <PasswordItem
                key={account._id || `${account.site}-${account.username}`}
                account={account}
                isShared={sharedPasswordSet.has(account.password)}
                onView={handleViewPassword}
              />
            ))
          )}
        </div>

        {/* Footer - count of stored passwords */}
        <div className="passwords-list-footer">
          🔒 {user.accounts.length} password{user.accounts.length !== 1 ? "s" : ""} stored securely
        </div>
      </div>

      {/* ---------- ADD PASSWORD POPUP ---------- */}
      <AddPasswordPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        userId={user._id}
        onAccountAdded={handleAccountAdded}
        showNotification={showNotification}
      />

      {/* ---------- MASTER PASSWORD POPUP ----------
          Visible only when an account is selected AND we don't have the password yet. */}
      <MasterPasswordPopup
        isOpen={selectedAccount !== null && decryptedPassword === null}
        onClose={handleCloseViewing}
        account={selectedAccount}
        userEmail={user.email}
        userId={user._id}
        onSuccess={handleMasterPasswordVerified}
      />

      {/* ---------- CREDENTIALS POPUP ----------
          Visible only when both an account is selected AND we have the decrypted password.
          Replaces the MasterPasswordPopup after successful verification. */}
      <CredentialsPopup
        isOpen={selectedAccount !== null && decryptedPassword !== null}
        onClose={handleCloseViewing}
        account={selectedAccount}
        decryptedPassword={decryptedPassword}
        showNotification={showNotification}
      />
    </div>
  );
}

export default PasswordList;