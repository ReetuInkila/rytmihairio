import React, { useState } from 'react';
import Login from './Login';
import Main from './Main';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (user) => {
    setLoggedIn(true);
  };

  return (
    <div>
      {loggedIn ? (
        <Main/>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;