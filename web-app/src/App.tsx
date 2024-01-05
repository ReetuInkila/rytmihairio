import React, { useState, useEffect } from 'react';
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
        const access_token = localStorage.getItem('access_token');
        const response = await fetch('https://syke-backend-w6xkb6ulza-lz.a.run.app/check_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: access_token }),
        });
        console.log(response);

        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setLoggedIn(true);
          } else {
            console.error('Token is not valid:', data.message);
          }
        } else {
          console.error('Failed to check token validity');
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
        <p>Loading...</p>
      ) : loggedIn ? (
        <Main />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
