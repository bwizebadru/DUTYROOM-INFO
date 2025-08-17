
import React, { useState } from 'react';
import type { TeamLeader } from '../types';

interface TeamLeaderSelectionProps {
  teamLeaders: TeamLeader[];
  selectedTeamLeader: string;
  selectedTeamLeaderPin: string;
  onTeamLeaderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddNewTeamLeader: (name: string, pin: string) => void;
  dateOfEntry: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  routes: string[];
  selectedRoute: string;
  onRouteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddNewRoute: (route: string) => void;
  validationErrors: { [key: string]: string };
}

export const TeamLeaderSelection: React.FC<TeamLeaderSelectionProps> = ({ 
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
  
  const handleLeaderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleRouteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddRouteClick();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 mb-6">Operational Information</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="dateOfEntry" className="block text-sm font-medium text-slate-700">Date of Entry</label>
          <input
            type="date"
            id="dateOfEntry"
            name="dateOfEntry"
            value={dateOfEntry}
            onChange={onDateChange}
            className={`mt-1 block w-full pl-3 pr-2 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${validationErrors.dateOfEntry ? 'border-red-500' : 'border-slate-300'}`}
          />
          {validationErrors.dateOfEntry && <p className="mt-1 text-xs text-red-600">{validationErrors.dateOfEntry}</p>}
        </div>
        
        <div className="border-t border-slate-200 pt-6">
          <label htmlFor="teamLeader" className="block text-sm font-medium text-slate-700">Select Team Leader</label>
          <select
            id="teamLeader"
            name="teamLeader"
            value={selectedTeamLeader}
            onChange={onTeamLeaderChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${validationErrors.selectedTeamLeader ? 'border-red-500' : 'border-slate-300'}`}
          >
            <option value="" disabled>-- Select a team leader --</option>
            {teamLeaders.map(leader => (
              <option key={leader.name} value={leader.name}>{leader.name}</option>
            ))}
          </select>
          {validationErrors.selectedTeamLeader && <p className="mt-1 text-xs text-red-600">{validationErrors.selectedTeamLeader}</p>}
          {selectedTeamLeaderPin && (
            <p className="mt-2 text-sm text-slate-600">
              PIN: <span className="font-medium text-slate-800">{selectedTeamLeaderPin}</span>
            </p>
          )}

          <div className="mt-4">
            <p className="block text-sm font-medium text-slate-700">Add New Team Leader</p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                type="text"
                name="newTeamLeaderName"
                value={newLeaderName}
                onChange={(e) => setNewLeaderName(e.target.value)}
                onKeyDown={handleLeaderKeyDown}
                placeholder="Name"
                className="sm:col-span-2 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <input
                type="text"
                name="newTeamLeaderPin"
                value={newLeaderPin}
                onChange={(e) => setNewLeaderPin(e.target.value)}
                onKeyDown={handleLeaderKeyDown}
                placeholder="PIN"
                className="sm:col-span-2 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={handleAddLeaderClick}
                type="button"
                className="sm:col-span-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
           <label htmlFor="route" className="block text-sm font-medium text-slate-700">Select Route</label>
           <select
                id="route"
                name="route"
                value={selectedRoute}
                onChange={onRouteChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${validationErrors.selectedRoute ? 'border-red-500' : 'border-slate-300'}`}
            >
                <option value="" disabled>-- Select a route --</option>
                {routes.map(route => (
                <option key={route} value={route}>{route}</option>
                ))}
            </select>
            {validationErrors.selectedRoute && <p className="mt-1 text-xs text-red-600">{validationErrors.selectedRoute}</p>}
            <div className="mt-4">
              <p className="block text-sm font-medium text-slate-700">Add New Route</p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <input
                      type="text"
                      name="newRoute"
                      value={newRoute}
                      onChange={(e) => setNewRoute(e.target.value)}
                      onKeyDown={handleRouteKeyDown}
                      placeholder="e.g., Abuja - Kaduna"
                      className="sm:col-span-4 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                      onClick={handleAddRouteClick}
                      type="button"
                      className="sm:col-span-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                      Add
                  </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
