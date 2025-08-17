
import React, { useState } from 'react';
import { exportToDoc, exportToXls } from '../services/exportService.js';
import { DocIcon } from './icons/DocIcon.js';
import { XlsIcon } from './icons/XlsIcon.js';

const reportFields = [
  { key: 'dateOfEntry', label: 'Date of Entry' },
  { key: 'route', label: 'Route' },
  { key: 'teamLeader', label: 'Team Leader' },
  { key: 'teamLeaderPin', label: 'Team Leader PIN' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'ticket', label: 'Ticket Number' },
  { key: 'offence', label: 'Offence(s)' },
  { key: 'actionTaken', label: 'Action Taken' },
  { key: 'currencyType', label: 'Currency Type' },
  { key: 'amountOffered', label: 'Amount Offered' },
  { key: 'currencyNumber', label: 'Currency Number' },
  { key: 'vehicleNumberPlate', label: 'Vehicle Number Plate' },
  { key: 'vehicleColor', label: 'Vehicle Color' },
  { key: 'vehicleMake', label: 'Vehicle Make' },
  { key: 'vehicleType', label: 'Vehicle Type' },
  { key: 'vehicleCategory', label: 'Vehicle Category' },
];

const initialColumns = reportFields.reduce((acc, field) => {
    acc[field.key] = true;
    return acc;
}, {});


export const ExportSection = ({ reports, offences }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(initialColumns);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getFilteredReports = () => {
    if (!startDate && !endDate) return reports;
    return reports.filter(report => {
      const reportDate = report.dateOfEntry;
      if (startDate && reportDate < startDate) return false;
      if (endDate && reportDate > endDate) return false;
      return true;
    });
  };

  const filteredReports = getFilteredReports();
  const isDataEmpty = filteredReports.length === 0;


  const handleColumnSelectionChange = (fieldKey) => {
    setSelectedColumns(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleSelectAll = () => setSelectedColumns(initialColumns);
  const handleDeselectAll = () => {
    const deselected = Object.keys(initialColumns).reduce((acc, key) => {
        acc[key] = false;
        return acc;
    }, {});
    setSelectedColumns(deselected);
  };

  const handleDocExport = () => {
    exportToDoc(filteredReports, selectedColumns, offences);
  };

  const handleXlsExport = () => {
    exportToXls(filteredReports, selectedColumns, offences);
  };

  return (
    React.createElement('div', { className: 'sticky top-8 p-6 bg-white rounded-lg shadow-md' },
      React.createElement('h2', { className: 'text-xl font-semibold text-slate-800 border-b pb-3 mb-6' }, 'Export Options'),
      React.createElement('div', { className: 'space-y-4' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-sm font-medium text-slate-700 mb-1' }, 'Filter by Date Range (Optional)'),
          React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
            React.createElement('div', null,
              React.createElement('label', { htmlFor: 'export-start-date', className: 'block text-xs text-slate-600' }, 'Start Date'),
              React.createElement('input', {
                type: 'date',
                id: 'export-start-date',
                value: startDate,
                onChange: e => setStartDate(e.target.value),
                className: 'mt-1 block w-full text-sm rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: 'export-end-date', className: 'block text-xs text-slate-600' }, 'End Date'),
              React.createElement('input', {
                type: 'date',
                id: 'export-end-date',
                value: endDate,
                onChange: e => setEndDate(e.target.value),
                className: 'mt-1 block w-full text-sm rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              })
            )
          )
        ),
        React.createElement('div', null,
          React.createElement('button', {
            onClick: () => setIsFilterVisible(!isFilterVisible),
            className: 'w-full text-left px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500'
          }, `${isFilterVisible ? 'Hide' : 'Show'} Export Column Filters`),
          isFilterVisible && (
            React.createElement('div', { className: 'mt-2 p-4 border border-slate-200 rounded-md bg-white' },
              React.createElement('div', { className: 'flex justify-between items-center mb-2' },
                React.createElement('p', { className: 'text-sm font-medium text-slate-800' }, 'Select columns to export:'),
                React.createElement('div', { className: 'space-x-2' },
                  React.createElement('button', { onClick: handleSelectAll, className: 'text-xs font-semibold text-indigo-600 hover:text-indigo-800' }, 'All'),
                  React.createElement('button', { onClick: handleDeselectAll, className: 'text-xs font-semibold text-indigo-600 hover:text-indigo-800' }, 'None')
                )
              ),
              React.createElement('div', { className: 'grid grid-cols-2 gap-2 max-h-60 overflow-y-auto' },
                reportFields.map(field => (
                  React.createElement('div', { key: field.key, className: 'flex items-center' },
                    React.createElement('input', {
                      id: `filter-${field.key}`,
                      type: 'checkbox',
                      checked: selectedColumns[field.key],
                      onChange: () => handleColumnSelectionChange(field.key),
                      className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                    }),
                    React.createElement('label', { htmlFor: `filter-${field.key}`, className: 'ml-2 block text-sm text-slate-700' }, field.label)
                  )
                ))
              )
            )
          )
        )
      ),
      React.createElement('div', { className: 'space-y-4 border-t border-slate-200 mt-4 pt-4' },
        React.createElement('p', { className: 'text-sm text-slate-600' }, 'Export all submitted reports that match your filter criteria.'),
        React.createElement('button', {
          onClick: handleDocExport,
          disabled: isDataEmpty,
          className: 'w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed'
        },
          React.createElement(DocIcon),
          React.createElement('span', { className: 'ml-2' }, `Export (${filteredReports.length}) as DOC`)
        ),
        React.createElement('button', {
          onClick: handleXlsExport,
          disabled: isDataEmpty,
          className: 'w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-300 disabled:cursor-not-allowed'
        },
          React.createElement(XlsIcon),
          React.createElement('span', { className: 'ml-2' }, `Export (${filteredReports.length}) as XLS`)
        ),
        isDataEmpty && (
          React.createElement('p', { className: 'text-xs text-center text-slate-500 pt-2' }, 'No reports match your current filters.')
        )
      )
    )
  );
};