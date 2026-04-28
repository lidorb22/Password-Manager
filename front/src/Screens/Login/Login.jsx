import { useState } from "react";
import "./Login.css";
import AuthHeader from "../../components/AuthHeader/AuthHeader";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import { loginUser } from "../../API/controller";

/* Login screen - email and master password sign in */
function Login({ onBack, onLoginSuccess, showNotification }) {
  /* Form state */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* Handle login submission */
  const handleSignIn = async () => {
    /* Basic validation */
    if (!email || !password) {
      showNotification("WRONG_CREDENTIALS");
      return;
    }

    setIsLoading(true);
    try {
      const userData = await loginUser({ email, password });
      showNotification("LOGIN_SUCCESS");
      /* Pass user data to parent for next screen */
      onLoginSuccess(userData);
    } catch (error) {
      console.error("Login error:", error);
      showNotification("WRONG_CREDENTIALS");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Header with lock icon and back button */}
      <AuthHeader
        title="Welcome Back!"
        subtitle="Sign in to your secure vault"
        icon="lock"
        onBack={onBack}
      />

      {/* Main content */}
      <div className="login-content">
        <div className="login-titles">
          <h2 className="login-title">Sign In</h2>
          <p className="login-subtitle">Enter your credentials to continue</p>
        </div>

        {/* Form fields */}
        <div className="login-form">
          <TextField
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Master Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your master password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={showPassword ? "🙈" : "👁"}
            onRightIconClick={() => setShowPassword(!showPassword)}
          />
        </div>

        {/* Sign in button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>

      {/* Footer with security badge */}
      <div className="login-footer">
        <span className="login-footer-icon">🔒</span>
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
}

export default Login;