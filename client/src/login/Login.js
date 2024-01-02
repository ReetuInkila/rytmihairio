import React, { useRef, useState } from 'react';
import './Login.css';
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
        let url = 'http://localhost:8080/'
        let url1= "https://syke-backend-w6xkb6ulza-lz.a.run.app/"

        const res = await fetch(url+"verify", {
          method: "POST",
          body: JSON.stringify({ captchaValue }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          onLogin(data.access_token);
        } else {
          console.log(res);
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
    <div id='kirjaudu'>
      <h2>Kirjaudu sivulle</h2>
      <form onSubmit={submitForm}>
        <ReCAPTCHA sitekey={'6Lfjkj4pAAAAAKRGy4GsmUgAS5UXEAphLKaqJvaj'} ref={recaptcha} />
        <button type="submit" disabled={loading}>
          {loading ? 'Kirjaudutaan...' : 'Kirjaudu'}
        </button>
      </form>
    </div>
  );
};

export default Login;
