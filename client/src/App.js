import React, { useState } from 'react';
import Login from './login/Login';
import Main from './main/Main';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (access_token) => {
    localStorage.setItem('access_token', access_token);
    setLoggedIn(true);
  };

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
