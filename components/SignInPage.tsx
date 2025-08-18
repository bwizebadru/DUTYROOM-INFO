

import React, { useState } from 'react';

export const SignInPage = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = onSignIn(username, password);
    if (!success) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    React.createElement('div', { className: 'flex items-center justify-center min-h-screen' },
      React.createElement('div', { className: 'w-full max-w-md p-8 space-y-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl z-10' },
        React.createElement('div', { className: 'text-center' },
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-100' }, 'Sign In'),
          React.createElement('p', { className: 'mt-2 text-[#99ccff]' }, 'FRSC Operations E-Dashboard')
        ),
        React.createElement('form', { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
          error && (
            React.createElement('div', { className: 'p-3 bg-red-900/40 border border-red-700/60 text-red-300 rounded-md text-sm' },
              error
            )
          ),
          React.createElement('div', { className: 'rounded-md shadow-sm -space-y-px' },
            React.createElement('div', null,
              React.createElement('label', { htmlFor: 'username', className: 'sr-only' }, 'Username'),
              React.createElement('input', {
                id: 'username',
                name: 'username',
                type: 'text',
                autoComplete: 'username',
                required: true,
                className: 'appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-t-md focus:outline-none focus:ring-[#99ccff] focus:border-[#99ccff] focus:z-10 sm:text-sm',
                placeholder: 'Username',
                value: username,
                onChange: (e) => setUsername(e.target.value)
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: 'password', className: 'sr-only' }, 'Password'),
              React.createElement('input', {
                id: 'password',
                name: 'password',
                type: 'password',
                autoComplete: 'current-password',
                required: true,
                className: 'appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-b-md focus:outline-none focus:ring-[#99ccff] focus:border-[#99ccff] focus:z-10 sm:text-sm',
                placeholder: 'Password',
                value: password,
                onChange: (e) => setPassword(e.target.value)
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('button', {
              type: 'submit',
              className: 'group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm rounded-md text-blue-900 font-bold bg-[#99ccff] hover:bg-[#60a5fa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99ccff]'
            }, 'Sign in')
          )
        )
      )
    )
  );
};