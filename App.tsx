
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard.js';
import { SignInPage } from './components/SignInPage.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const handleSignIn = (username, password) => {
    if (username === 'frsc' && password === 'admin123') {
      sessionStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    React.createElement('div', { className: 'min-h-screen relative' },
      React.createElement('div', { className: 'relative z-10' },
        isAuthenticated ?
          React.createElement(Dashboard, { onSignOut: handleSignOut }) :
          React.createElement(SignInPage, { onSignIn: handleSignIn })
      )
    )
  );
};

export default App;