

import React, { useState, useMemo } from 'react';

const actionTakenMap = {
  impoundment: 'Impoundment',
  confiscation: 'Confiscation NDL',
  confiscation1: 'Confiscation VEH PAPER',
};

const getActionTakenDisplay = (value) => actionTakenMap[value] || value;

export const ReportsList = ({ reports, offences }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const offenceNameToCodeMap = useMemo(() => new Map(offences.map(o => [o.name, o.code])), [offences]);

  const filteredAndSortedReports = useMemo(() => reports
    .filter(report => {
      if (!startDate && !endDate) return true;
      const reportDate = report.dateOfEntry;
      if (startDate && reportDate < startDate) return false;
      if (endDate && reportDate > endDate) return false;
      return true;
    })
    .sort((a, b) => a.submissionTimestamp - b.submissionTimestamp), [reports, startDate, endDate]);

  const renderMultiOffenderData = (report, field) => {
    return report.formData.offenders.map(offender => {
        if (field === 'actionTaken') return getActionTakenDisplay(offender.actionTaken);
        if (field === 'offence') return offender.offence.map(name => offenceNameToCodeMap.get(name) || name).join('; ');

        if (['currencyType', 'amountOffered', 'currencyNumber'].includes(field)) {
            if (offender.offence.includes('ATTEMPTING TO CORRUPT MARSHAL') && offender.currencyDetails.length > 0) {
                return offender.currencyDetails.map(detail => detail[field]).join('; ');
            }
            return 'N/A';
        }
        
        const value = offender[field];

        if(Array.isArray(value)) return value.join('; ')
        
        return value || 'N/A';
    }).join(', ');
  };
  
  if (reports.length === 0) {
    return (
        React.createElement('div', { className: 'text-center py-12 mt-12 bg-white rounded-lg shadow-md' },
            React.createElement('h3', { className: 'text-lg font-medium text-slate-700' }, 'No reports submitted yet.'),
            React.createElement('p', { className: 'text-sm text-slate-500' }, 'Fill out and submit the form to see reports here.')
        )
    );
  }

  const tableHeaders = [
    'Date of Entry', 'Route', 'Team Leader', 'Team Leader PIN', 'Full Name(s)', 'Ticket Number(s)', 
    'Offence Code(s)', 'Action(s) Taken', 'Currency Type(s)', 'Amount(s) Offered', 'Currency Number(s)', 
    'Vehicle Plate(s)', 'Vehicle Color(s)', 'Vehicle Make(s)', 'Vehicle Type(s)', 'Vehicle Category(s)'
  ];

  const reportFields = [
    'dateOfEntry', 'route', 'teamLeader', 'teamLeaderPin', 'fullName', 'ticket', 'offence', 'actionTaken',
    'currencyType', 'amountOffered', 'currencyNumber', 'vehicleNumberPlate', 'vehicleColor', 'vehicleMake',
    'vehicleType', 'vehicleCategory'
  ];

  return (
    React.createElement('div', { className: 'mt-12' },
      React.createElement('div', { className: 'flex justify-between items-center mb-6' },
        React.createElement('h2', { className: 'text-2xl font-bold text-blue-900' }, 'Submitted Reports'),
        React.createElement('div', { className: 'flex items-center space-x-2' },
            React.createElement('label', { htmlFor: 'start-date', className: 'text-sm font-medium text-slate-700' }, 'From:'),
            React.createElement('input', { 
              type: 'date',
              id: 'start-date',
              value: startDate,
              onChange: e => setStartDate(e.target.value),
              className: 'block w-full text-sm rounded-md border-slate-300 shadow-sm focus:ring-blue-500 focus:border-blue-500'
            }),
            React.createElement('label', { htmlFor: 'end-date', className: 'text-sm font-medium text-slate-700' }, 'To:'),
            React.createElement('input', {
              type: 'date',
              id: 'end-date',
              value: endDate,
              onChange: e => setEndDate(e.target.value),
              className: 'block w-full text-sm rounded-md border-slate-300 shadow-sm focus:ring-blue-500 focus:border-blue-500'
            })
        )
      ),
      React.createElement('div', { className: 'bg-white rounded-lg shadow-md overflow-hidden' },
        React.createElement('div', { className: 'overflow-x-auto' },
          React.createElement('table', { className: 'min-w-full divide-y divide-slate-200 reports-table' },
            React.createElement('thead', { className: 'bg-slate-50' },
              React.createElement('tr', null,
                tableHeaders.map(header => React.createElement('th', { key: header, scope: 'col', className: 'px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider' }, header))
              )
            ),
            React.createElement('tbody', { className: 'bg-white divide-y divide-slate-200' },
              filteredAndSortedReports.map((report) => (
                React.createElement('tr', { key: report.id },
                  reportFields.map(field => React.createElement('td', { key: field, className: 'px-6 py-4 whitespace-normal text-sm text-slate-500' }, 
                    ['teamLeader'].includes(field) ? 
                    React.createElement('span', {className: 'font-medium text-slate-900'}, report[field]) :
                    ['dateOfEntry', 'route', 'teamLeaderPin'].includes(field) ? report[field] : renderMultiOffenderData(report, field)
                  ))
                )
              )),
              filteredAndSortedReports.length === 0 && (
                React.createElement('tr', null,
                  React.createElement('td', { colSpan: 16, className: 'text-center py-10 text-slate-500' }, 'No reports match your selected date range.')
                )
              )
            )
          )
        )
      )
    )
  );
};