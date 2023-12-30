import React, { useRef, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

const Login = ({ onLogin }) => {
  const recaptcha = useRef();
  const [loading, setLoading] = useState(false);

  async function submitForm(event) {
    event.preventDefault();
    const captchaValue = recaptcha.current.getValue();

    if (captchaValue) {
      try {
        setLoading(true);

        const res = await fetch("/verify", {
          method: "POST",
          body: JSON.stringify({ captchaValue }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data.success) {
          onLogin();
        } else {
          // Handle unsuccessful login (show error message, etc.)
        }
      } catch (error) {
        // Handle fetch error
        console.error("Error during login:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div>
      <h2>Kirjaudu sivulle</h2>
      <form onSubmit={submitForm}>
        <ReCAPTCHA sitekey={'6Lfjkj4pAAAAAKRGy4GsmUgAS5UXEAphLKaqJvaj'} ref={recaptcha} />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
