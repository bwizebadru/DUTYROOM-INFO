
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard.js';
import { SignInPage } from './components/SignInPage.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    if (isAuthenticated) {
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
    }
    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, [isAuthenticated]);

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