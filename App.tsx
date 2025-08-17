
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { SignInPage } from './components/SignInPage';
import { frscLogoBase64 } from './assets/logo';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check session storage to keep the user logged in on page refresh
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const handleSignIn = (username: string, password: string): boolean => {
    // Hardcoded credentials for demonstration purposes
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
    <div className="min-h-screen relative">
      <div 
        style={{ backgroundImage: `url(${frscLogoBase64})` }}
        className="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-5 pointer-events-none z-0"
      ></div>
      <div className="relative z-10">
        {isAuthenticated ? (
          <Dashboard onSignOut={handleSignOut} />
        ) : (
          <SignInPage onSignIn={handleSignIn} />
        )}
      </div>
    </div>
  );
};

export default App;
