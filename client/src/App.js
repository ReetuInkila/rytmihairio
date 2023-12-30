import React, { useState, useEffect } from 'react';
import Login from './Login';
import Main from './Main';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  useEffect(() => {
    // Function to check login status on the server
    const checkLoginStatus = async () => {
      try {
        // Make a request to the server to check login status
        const response = await fetch('https://syke-backend-w6xkb6ulza-lz.a.run.app/check_login');
        const data = await response.json();

        // If the server indicates the user is logged in, update the state
        if (data.loggedIn) {
          setLoggedIn(true);
        }

        // Update the checkComplete state to indicate that the check has completed
        setCheckComplete(true);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    // Call the function when the component mounts
    checkLoginStatus();
  }, []); // The empty dependency array ensures this effect runs once on mount

  // Don't render until the login status check is complete
  if (!checkComplete) {
    return null; // or a loading indicator, message, etc.
  }

  return (
    <div>
      {loggedIn ? (
        <Main />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
