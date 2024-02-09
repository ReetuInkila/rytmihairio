import React, { useRef, useState } from 'react';
import './Login.css';
import ReCAPTCHA from "react-google-recaptcha";

type LoginProps = {
    onLogin: (accessToken: string) => void;
}; 

function Login({ onLogin }:LoginProps){
    const recaptcha = useRef(null);
    const [loading, setLoading] = useState(false);

    async function submitForm(event: React.FormEvent) {
        event.preventDefault();
        const captchaValue = (recaptcha.current as any).getValue();

        if (captchaValue) {
            try {
                setLoading(true);
                const res = await fetch("https://syke-backend-w6xkb6ulza-lz.a.run.app/verify", {
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
