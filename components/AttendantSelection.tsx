
import React, { useState } from 'react';

export const TeamLeaderSelection = ({
  teamLeaders,
  selectedTeamLeader,
  selectedTeamLeaderPin,
  onTeamLeaderChange,
  onAddNewTeamLeader,
  dateOfEntry,
  onDateChange,
  routes,
  selectedRoute,
  onRouteChange,
  onAddNewRoute,
  validationErrors
}) => {
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newLeaderPin, setNewLeaderPin] = useState('');
  const [newRoute, setNewRoute] = useState('');

  const handleAddLeaderClick = () => {
    if (newLeaderName.trim() && newLeaderPin.trim()) {
      onAddNewTeamLeader(newLeaderName.trim(), newLeaderPin.trim());
      setNewLeaderName('');
      setNewLeaderPin('');
    }
  };

  const handleLeaderKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddLeaderClick();
    }
  };

  const handleAddRouteClick = () => {
    if (newRoute.trim()) {
      onAddNewRoute(newRoute.trim());
      setNewRoute('');
    }
  };

  const handleRouteKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddRouteClick();
    }
  };

  return (
    React.createElement('div', { className: 'p-6 bg-white rounded-lg shadow-md mb-8' },
      React.createElement('h2', { className: 'text-xl font-semibold text-slate-800 border-b pb-3 mb-6' }, 'Operational Information'),
      React.createElement('div', { className: 'space-y-6' },
        React.createElement('div', null,
          React.createElement('label', { htmlFor: 'dateOfEntry', className: 'block text-sm font-medium text-slate-700' }, 'Date of Entry'),
          React.createElement('input', {
            type: 'date',
            id: 'dateOfEntry',
            name: 'dateOfEntry',
            value: dateOfEntry,
            onChange: onDateChange,
            className: `mt-1 block w-full pl-3 pr-2 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${validationErrors.dateOfEntry ? 'border-red-500' : 'border-slate-300'}`
          }),
          validationErrors.dateOfEntry && React.createElement('p', { className: 'mt-1 text-xs text-red-600' }, validationErrors.dateOfEntry)
        ),
        React.createElement('div', { className: 'border-t border-slate-200 pt-6' },
          React.createElement('label', { htmlFor: 'teamLeader', className: 'block text-sm font-medium text-slate-700' }, 'Select Team Leader'),
          React.createElement('select', {
            id: 'teamLeader',
            name: 'teamLeader',
            value: selectedTeamLeader,
            onChange: onTeamLeaderChange,
            className: `mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${validationErrors.selectedTeamLeader ? 'border-red-500' : 'border-slate-300'}`
          },
            React.createElement('option', { value: '', disabled: true }, '-- Select a team leader --'),
            teamLeaders.map(leader =>
              React.createElement('option', { key: leader.name, value: leader.name }, leader.name)
            )
          ),
          validationErrors.selectedTeamLeader && React.createElement('p', { className: 'mt-1 text-xs text-red-600' }, validationErrors.selectedTeamLeader),
          selectedTeamLeaderPin && (
            React.createElement('p', { className: 'mt-2 text-sm text-slate-600' },
              'PIN: ',
              React.createElement('span', { className: 'font-medium text-slate-800' }, selectedTeamLeaderPin)
            )
          ),
          React.createElement('div', { className: 'mt-4' },
            React.createElement('p', { className: 'block text-sm font-medium text-slate-700' }, 'Add New Team Leader'),
            React.createElement('div', { className: 'mt-2 grid grid-cols-1 sm:grid-cols-5 gap-3' },
              React.createElement('input', {
                type: 'text',
                name: 'newTeamLeaderName',
                value: newLeaderName,
                onChange: (e) => setNewLeaderName(e.target.value),
                onKeyDown: handleLeaderKeyDown,
                placeholder: 'Name',
                className: 'sm:col-span-2 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              }),
              React.createElement('input', {
                type: 'text',
                name: 'newTeamLeaderPin',
                value: newLeaderPin,
                onChange: (e) => setNewLeaderPin(e.target.value),
                onKeyDown: handleLeaderKeyDown,
                placeholder: 'PIN',
                className: 'sm:col-span-2 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              }),
              React.createElement('button', {
                onClick: handleAddLeaderClick,
                type: 'button',
                className: 'sm:col-span-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }, 'Add')
            )
          )
        ),
        React.createElement('div', { className: 'border-t border-slate-200 pt-6' },
          React.createElement('label', { htmlFor: 'route', className: 'block text-sm font-medium text-slate-700' }, 'Select Route'),
          React.createElement('select', {
            id: 'route',
            name: 'route',
            value: selectedRoute,
            onChange: onRouteChange,
            className: `mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${validationErrors.selectedRoute ? 'border-red-500' : 'border-slate-300'}`
          },
            React.createElement('option', { value: '', disabled: true }, '-- Select a route --'),
            routes.map(route =>
              React.createElement('option', { key: route, value: route }, route)
            )
          ),
          validationErrors.selectedRoute && React.createElement('p', { className: 'mt-1 text-xs text-red-600' }, validationErrors.selectedRoute),
          React.createElement('div', { className: 'mt-4' },
            React.createElement('p', { className: 'block text-sm font-medium text-slate-700' }, 'Add New Route'),
            React.createElement('div', { className: 'mt-2 grid grid-cols-1 sm:grid-cols-5 gap-3' },
              React.createElement('input', {
                type: 'text',
                name: 'newRoute',
                value: newRoute,
                onChange: (e) => setNewRoute(e.target.value),
                onKeyDown: handleRouteKeyDown,
                placeholder: 'e.g., Abuja - Kaduna',
                className: 'sm:col-span-4 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              }),
              React.createElement('button', {
                onClick: handleAddRouteClick,
                type: 'button',
                className: 'sm:col-span-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }, 'Add')
            )
          )
        )
      )
    )
  );
};