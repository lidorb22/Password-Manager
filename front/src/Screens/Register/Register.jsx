import { useState, useEffect } from "react";
import "./Register.css";
import AuthHeader from "../../components/AuthHeader/AuthHeader";
import ProgressDots from "../../components/ProgressDots/ProgressDots";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import { registerUser } from "../../API/controller";
import confetti from "canvas-confetti";
import MasterPassword from "./MasterPassword/MasterPassword";

/* Multi-step registration flow: Email -> Name -> Password -> Success */
function Register({ onBack, onRegisterSuccess, showNotification }) {

  /* ============================================================
     SECTION 1: STATE
     ============================================================ */

  /* Current step (1-4) */
  const [step, setStep] = useState(1);

  /* Form data accumulated across steps */
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");

  /* User data returned from the server after successful registration. */
  const [registeredUser, setRegisteredUser] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  /* ============================================================
     SECTION 2: VALIDATION
     ============================================================ */

  /* Email validation regex */
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /* ============================================================
     SECTION 3: NAVIGATION HANDLERS
     ============================================================ */

  /* Handle moving forward through steps 1 and 2.
     Step 3 has its own submission flow (handleCreateVault).
     Step 4 transitions automatically (no button press). */
  const handleNext = () => {
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
      if (!firstname.trim()) {
        showNotification("WRONG_CREDENTIALS");
        return;
      }
      setStep(3);
      return;
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


  /* ============================================================
     SECTION 4: STEP 3 - CREATE VAULT SUBMISSION
     ============================================================ */

  const handleCreateVault = async (password) => {
    setIsLoading(true);
    try {
      /* Send the registration to the server.
         Save the returned user data for use in step 4. */
      
      const userData = await registerUser({ firstname,email,password });
      setRegisteredUser(userData);
      setStep(4);
    } catch (error) {
      console.error("Registration error:", error);
      showNotification("REGISTRATION_FAILED");
    } finally {
      setIsLoading(false);
    }
  };

    /* ============================================================
     SECTION 4.5: SUCCESS SCREEN EFFECT
     ============================================================ */

      useEffect(() => {
       if (step !== 4) return;

      /* Fire confetti from both sides for a celebration effect. */
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        });
      }, 250);

      /* Auto-transition to the vault after 10 seconds. */
      const timer = setTimeout(() => {
        onRegisterSuccess(registeredUser);
      }, 10000);

      /* Cleanup - if the component unmounts before the timer fires, cancel the pending transition. */
      return () => clearTimeout(timer);
    }, [step]);


  /* ============================================================
     SECTION 5: RENDER (JSX)
     What the user actually sees on the screen.
     ============================================================ */

  return (
    <div className="register-screen">

      {/* ---------- HEADER ---------- */}
      <AuthHeader
        title="Create Account"
        subtitle="Join your secure vault"
        icon="shield"
        onBack={handleBack}
      />

      {/* ---------- CONTENT AREA ---------- */}
      <div className="register-content">

        {/* Progress dots indicator  */}
        <ProgressDots total={4} current={step} />

        {/* ===== STEP 1: EMAIL ===== */}
        {step === 1 && (
          <>
            <div className="register-titles">
              <h2 className="register-title">Create Your Account</h2>
              <p className="register-subtitle">Enter your email to get started</p>
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

        {/* ===== STEP 2: NAME ===== */}
        {step === 2 && (
          <>
            <div className="register-titles">
              <h2 className="register-title">What's Your Name?</h2>
              <p className="register-subtitle">We'll use this to greet you</p>
            </div>

            <div className="register-form">
              <TextField
                label="Your Name"
                placeholder="Enter your name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>

            {/* Bottom navigation - Back and Continue side by side */}
            <div className="register-actions">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Continue
              </Button>
            </div>
          </>
        )}

        {/* ===== STEP 3: MASTER PASSWORD ===== */}
        {step === 3 && (
          <MasterPassword
            onSubmit={handleCreateVault}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}

        {/* ===== STEP 4: SUCCESS ===== */}
        {step === 4 && (
          <div className="register-success">
            <div className="register-success-icon">✓</div>
            <h2 className="register-title">Account Created!</h2>
            <p className="register-subtitle">Your secure vault is ready to use</p>

            {/* Loading bar - fills from 0% to 100% over 10 seconds */}
             <div className="register-success-progress">
              <div className="register-success-progress-bar" />
             </div>
          </div>
        )}

        {/* ---------- CONTINUE BUTTON  ---------- */}
        {step === 1 && (
          <Button
            variant="primary"
            fullWidth
            onClick={handleNext}
          >
            Continue
          </Button>
        )}

      </div>
    </div>
  );
}

export default Register;