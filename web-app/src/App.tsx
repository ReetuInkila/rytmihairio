import React, { useState, useEffect } from 'react';
import LoadingScreen from './main/LoadingScreen'
import Login from './login/Login';
import Main from './main/Main';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleLogin = (access_token: string) => {
        localStorage.setItem('access_token', access_token);
        setLoggedIn(true);
    };

    useEffect(() => {
        const checkTokenValidity = async () => {
            try {
                const access_token: string|null = localStorage.getItem('access_token');
                if (access_token){// if access token stored, check if it's still valid
                    const response = await fetch('https://syke-backend-w6xkb6ulza-lz.a.run.app/check_token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: access_token }),
                    });

                    const data = await response.json();
                    if (data.valid) {
                        setLoggedIn(true);
                    } else {
                        console.error('Token is not valid:', data.message);
                    }
                }else{
                    console.log('No stored access token.')
                }
            } catch (error) {
                console.error('An error occurred during token validity check:', error);
            } finally {
                setLoading(false);
            }
        };
        checkTokenValidity();
    }, []);

    return (
        <div>
        {loading ? (
            <LoadingScreen/>
        ) : loggedIn ? (
            <Main />
        ) : (
            <Login onLogin={handleLogin} />
        )}
        </div>
    );
};

export default App;
