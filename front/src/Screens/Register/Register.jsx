import { useState } from "react";
import "./Register.css";
import AuthHeader from "../../components/AuthHeader/AuthHeader";
import ProgressDots from "../../components/ProgressDots/ProgressDots";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import { registerUser } from "../../API/controller";

/* Multi-step registration flow: Email -> Name -> Password -> Success */
function Register({ onBack, onRegisterSuccess, showNotification }) {
  /* Current step (1-4) */
  const [step, setStep] = useState(1);

  /* Form data accumulated across steps */
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* Email validation regex */
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /* Handle moving forward through steps */
  const handleNext = async () => {
    /* Step 1: validate email */
    if (step === 1) {
      if (!emailRegex.test(email)) {
        showNotification("WRONG_CREDENTIALS");
        return;
      }
      setStep(2);
      return;
    }

    /* Step 2: validate name */
    if (step === 2) {
      if (!firstname.trim() || !lastname.trim()) {
        showNotification("WRONG_CREDENTIALS");
        return;
      }
      setStep(3);
      return;
    }

    /* Step 3: validate password and create account */
    if (step === 3) {
      if (password.length < 8) {
        showNotification("WRONG_CREDENTIALS");
        return;
      }

      setIsLoading(true);
      try {
        await registerUser({ firstname, lastname, email, password });
        showNotification("REGISTRATION_SUCCESS");
        setStep(4);
      } catch (error) {
        console.error("Registration error:", error);
        showNotification("SERVER_ERROR");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    /* Step 4: finish registration */
    if (step === 4) {
      onRegisterSuccess();
    }
  };

  /* Handle going back */
  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="register-screen">
      {/* Header with shield icon and back arrow */}
      <AuthHeader
        title="Create Account"
        subtitle="Join your secure vault"
        icon="shield"
        onBack={handleBack}
      />

      {/* Main content */}
      <div className="register-content">
        {/* Progress indicator */}
        <ProgressDots total={4} current={step} />

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <div className="register-titles">
              <h2 className="register-title">Create Your Account</h2>
              <p className="register-subtitle">Let's start with your email</p>
            </div>

            <TextField
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <>
            <div className="register-titles">
              <h2 className="register-title">What's Your Name?</h2>
              <p className="register-subtitle">Tell us how to address you</p>
            </div>

            <div className="register-form">
              <TextField
                label="First Name"
                placeholder="Enter your first name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <TextField
                label="Last Name"
                placeholder="Enter your last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Step 3: Master Password */}
        {step === 3 && (
          <>
            <div className="register-titles">
              <h2 className="register-title">Create Master Password</h2>
              <p className="register-subtitle">
                This will protect all your other passwords
              </p>
            </div>

            <TextField
              label="Master Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter master password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightIcon={showPassword ? "🙈" : "👁"}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />
          </>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="register-success">
            <div className="register-success-icon">✓</div>
            <h2 className="register-title">Account Created!</h2>
            <p className="register-subtitle">Welcome to Password Manager</p>
          </div>
        )}

        {/* Continue / Action button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleNext}
          disabled={isLoading}
        >
          {step === 4
            ? "Get Started"
            : isLoading
            ? "Creating account..."
            : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export default Register;