import { useState } from "react";
import Notification from "./components/Notification/Notification";
import Card from "./components/Card/Card";
import Welcome from "./screens/Welcome/Welcome";
import Login from "./screens/Login/Login";
import Register from "./screens/Register/Register";
import { useNotification } from "./hooks/useNotification";

function App() {
  /* Current screen state - controls which screen is shown */
  const [currentScreen, setCurrentScreen] = useState("welcome");

  /* Logged-in user data - set after successful login */
  const [currentUser, setCurrentUser] = useState(null);

  /* Pop-up notification management */
  const { notification, hideNotification, showNotification } = useNotification();

  /* 
    Redirect and autofill function
    Sends a message to the Background Script to open the website and fill in the credentials
    Should be called from the passwords list component
  */
  // eslint-disable-next-line no-unused-vars
  const redirectAndAutofill = async (link, username, password) => {
    try {
      await chrome.runtime.sendMessage({
        action: "redirectAndAutofill",
        link,
        username,
        password,
      });
    } catch (error) {
      console.error("Message error:", error);
      showNotification("SERVER_ERROR");
    }
  };

  return (
    <Card>
      {/* Pop-up notification - shown at top of screen when active */}
      <Notification
        message={notification.message}
        icon={notification.icon}
        type={notification.type}
        onClose={hideNotification}
      />

     {/* Show Welcome screen */}
      {currentScreen === "welcome" && (
        <Welcome
          onCreateAccount={() => setCurrentScreen("register")}
          onSignIn={() => setCurrentScreen("login")}
        />
      )}

      {/* Show Login screen */}
      {currentScreen === "login" && (
        <Login
          onBack={() => setCurrentScreen("welcome")}
          onLoginSuccess={(userData) => {
            setCurrentUser(userData);
            setCurrentScreen("passwords");
          }}
          showNotification={showNotification}
        />
      )}

      {/* Show Register screen */}
      {currentScreen === "register" && (
        <Register
        onBack={() => setCurrentScreen("welcome")}
        onRegisterSuccess={() => setCurrentScreen("login")}
        showNotification={showNotification}
        />
      )}
    </Card>
  );
}

export default App;