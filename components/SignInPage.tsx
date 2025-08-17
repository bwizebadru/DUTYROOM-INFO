
import React, { useState } from 'react';
import { frscLogoBase64 } from '../assets/logo.js';

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
      React.createElement('div', { className: 'w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg z-10' },
        React.createElement('div', { className: 'text-center' },
          React.createElement('img', { src: frscLogoBase64, alt: 'FRSC Logo', className: 'w-24 h-24 mx-auto mb-4' }),
          React.createElement('h1', { className: 'text-3xl font-bold text-slate-800' }, 'Sign In'),
          React.createElement('p', { className: 'mt-2 text-slate-600' }, 'FRSC Operations E-Dashboard')
        ),
        React.createElement('form', { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
          error && (
            React.createElement('div', { className: 'p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm' },
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
                className: 'appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
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
                className: 'appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                placeholder: 'Password',
                value: password,
                onChange: (e) => setPassword(e.target.value)
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('button', {
              type: 'submit',
              className: 'group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }, 'Sign in')
          )
        )
      )
    )
  );
};
