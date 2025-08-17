
import React, { useState } from 'react';
import { TrashIcon } from './icons/TrashIcon.js';
import { PlusIcon } from './icons/PlusIcon.js';

const InputField = ({ label, name, value, onChange, type = 'text', placeholder, error }) => (
  React.createElement('div', null,
    React.createElement('label', { htmlFor: name, className: 'block text-sm font-medium text-slate-700' }, label),
    React.createElement('input', {
      type: type,
      id: name,
      name: name,
      value: value,
      onChange: onChange,
      placeholder: placeholder,
      className: `mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${error ? 'border-red-500' : 'border-slate-300'}`
    }),
    error && React.createElement('p', { className: 'mt-1 text-xs text-red-600' }, error)
  )
);

const SelectField = (props) => (
    React.createElement('div', null,
      React.createElement('label', { htmlFor: props.id, className: 'block text-sm font-medium text-slate-700' }, props.label),
      React.createElement('select', {
        id: props.id,
        name: props.name,
        value: props.value,
        onChange: props.onChange,
        disabled: props.disabled || false,
        className: `mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${props.error ? 'border-red-500' : 'border-slate-300'}`
      }, props.children),
      props.error && React.createElement('p', { className: 'mt-1 text-xs text-red-600' }, props.error)
    )
  );

export const OffenderInfoForm = ({
  offenderInfo,
  index,
  isMultiForm,
  onChange,
  onOffenceChange,
  offences,
  currencies,
  onAddNewOffence,
  onAddNewCurrency,
  onCurrencyDetailChange,
  onAddCurrencyDetail,
  onRemoveCurrencyDetail,
  onRemove,
  showRemoveButton,
  validationErrors,
}) => {
  const [newOffence, setNewOffence] = useState({ name: '', code: '' });
  const [newCurrency, setNewCurrency] = useState('');
  const isAcsSelected = offenderInfo.offence.includes('ATTEMPTING TO CORRUPT MARSHAL');

  const getError = (fieldName) => validationErrors[`offender-${index}-${fieldName}`];
  const getCurrencyError = (currencyIndex, fieldName) => validationErrors[`offender-${index}-currency-${currencyIndex}-${fieldName}`];

  const handleAddOffenceClick = () => {
    if (newOffence.name.trim() && newOffence.code.trim()) {
      onAddNewOffence({
        name: newOffence.name.trim(),
        code: newOffence.code.trim().toUpperCase(),
      });
      setNewOffence({ name: '', code: '' });
    }
  };

  const handleAddCurrencyClick = () => {
    if (newCurrency.trim()) {
      onAddNewCurrency(newCurrency.trim());
      setNewCurrency('');
    }
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };

  return (
    React.createElement('div', { className: 'p-6 bg-white rounded-lg shadow-md relative border border-slate-200' },
      showRemoveButton && (
        React.createElement('button', {
          onClick: () => onRemove(index),
          className: 'absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors',
          'aria-label': `Remove Offender #${index + 1}`
        }, React.createElement(TrashIcon))
      ),
      React.createElement('h2', { className: 'text-xl font-semibold text-slate-800 border-b pb-3 mb-6' }, `Offender Information ${isMultiForm ? ` #${index + 1}` : ''}`),
      React.createElement('div', { className: 'grid grid-cols-1 gap-6 sm:grid-cols-2' },
        React.createElement(InputField, { label: 'Full Name', name: 'fullName', value: offenderInfo.fullName, onChange: (e) => onChange(index, e), placeholder: 'John Doe', error: getError('fullName') }),
        React.createElement(InputField, { label: 'Ticket Number', name: 'ticket', value: offenderInfo.ticket, onChange: (e) => onChange(index, e), type: 'text', placeholder: '0011D1A09999', error: getError('ticket') }),
        React.createElement(InputField, { label: 'Vehicle Number Plate', name: 'vehicleNumberPlate', value: offenderInfo.vehicleNumberPlate, onChange: (e) => onChange(index, e), placeholder: 'ABC-123-XYZ', error: getError('vehicleNumberPlate') }),
        React.createElement(InputField, { label: 'Vehicle Color', name: 'vehicleColor', value: offenderInfo.vehicleColor, onChange: (e) => onChange(index, e), placeholder: 'Red', error: getError('vehicleColor') }),
        React.createElement(InputField, { label: 'Vehicle Make', name: 'vehicleMake', value: offenderInfo.vehicleMake, onChange: (e) => onChange(index, e), placeholder: 'Toyota', error: getError('vehicleMake') }),
        React.createElement(InputField, { label: 'Vehicle Type', name: 'vehicleType', value: offenderInfo.vehicleType, onChange: (e) => onChange(index, e), placeholder: 'Sedan', error: getError('vehicleType') }),
        React.createElement(SelectField, {
            label: 'Vehicle Category',
            id: `vehicleCategory-${index}`,
            name: 'vehicleCategory',
            value: offenderInfo.vehicleCategory,
            onChange: (e) => onChange(index, e),
            error: getError('vehicleCategory')
          },
            React.createElement('option', { value: '', disabled: true }, '-- Select a category --'),
            React.createElement('option', { value: 'Motorcycle' }, 'Motorcycle'),
            React.createElement('option', { value: 'Pickup' }, 'Pickup'),
            React.createElement('option', { value: 'Bus' }, 'Bus'),
            React.createElement('option', { value: 'Car' }, 'Car'),
            React.createElement('option', { value: 'Jeep' }, 'Jeep'),
            React.createElement('option', { value: 'Truck' }, 'Truck'),
            React.createElement('option', { value: 'Articulated' }, 'Articulated'),
            React.createElement('option', { value: 'Tanker' }, 'Tanker')
        )
      ),
      React.createElement('div', { className: 'border-t border-slate-200 mt-6 pt-6' },
        React.createElement('label', { className: 'block text-sm font-medium text-slate-700' }, 'Offence(s)'),
        React.createElement('div', { className: `mt-2 space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-slate-50 ${getError('offence') ? 'border-red-500' : 'border-slate-200'}` },
          offences.map(offence =>
            React.createElement('div', { key: offence.code, className: 'flex items-center' },
              React.createElement('input', {
                id: `offence-${index}-${offence.code}`,
                name: 'offence',
                type: 'checkbox',
                checked: offenderInfo.offence.includes(offence.name),
                onChange: (e) => onOffenceChange(index, offence.name, e.target.checked),
                className: 'h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              }),
              React.createElement('label', { htmlFor: `offence-${index}-${offence.code}`, className: 'ml-3 block text-sm text-slate-900' }, `${offence.code} - ${offence.name}`)
            )
          )
        ),
        getError('offence') && React.createElement('p', { className: 'mt-1 text-xs text-red-600' }, getError('offence')),
        React.createElement('div', { className: 'mt-4' },
          React.createElement('p', { className: 'block text-sm font-medium text-slate-700' }, 'Add New Offence'),
          React.createElement('div', { className: 'mt-2 grid grid-cols-1 sm:grid-cols-5 gap-3' },
            React.createElement('input', { type: 'text', name: 'newOffenceCode', value: newOffence.code, onChange: (e) => setNewOffence(prev => ({ ...prev, code: e.target.value })), onKeyDown: (e) => handleKeyDown(e, handleAddOffenceClick), placeholder: 'Code', className: 'sm:col-span-1 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' }),
            React.createElement('input', { type: 'text', name: 'newOffenceName', value: newOffence.name, onChange: (e) => setNewOffence(prev => ({ ...prev, name: e.target.value })), onKeyDown: (e) => handleKeyDown(e, handleAddOffenceClick), placeholder: 'e.g., Illegal Parking', className: 'sm:col-span-3 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' }),
            React.createElement('button', { onClick: handleAddOffenceClick, type: 'button', className: 'sm:col-span-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' }, 'Add')
          )
        )
      ),
      isAcsSelected && (
        React.createElement('div', { className: 'border-t border-slate-200 mt-6 pt-6 bg-amber-50 p-4 rounded-md' },
          React.createElement('h3', { className: 'text-md font-semibold text-slate-800 mb-4' }, 'Currency Offered Details (ACS)'),
          React.createElement('div', { className: 'space-y-4' },
            offenderInfo.currencyDetails.map((detail, currencyIndex) => (
              React.createElement('div', { key: detail.id, className: 'p-3 border border-amber-200 rounded-lg bg-white relative' },
                offenderInfo.currencyDetails.length > 1 && (
                  React.createElement('button', { onClick: () => onRemoveCurrencyDetail(index, detail.id), className: 'absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600', 'aria-label': 'Remove currency entry' }, React.createElement(TrashIcon))
                ),
                React.createElement('div', { className: 'grid grid-cols-1 gap-4 sm:grid-cols-3' },
                  React.createElement(SelectField, {
                      label: 'Currency Type',
                      id: `currencyType-${index}-${currencyIndex}`,
                      name: 'currencyType',
                      value: detail.currencyType,
                      onChange: (e) => onCurrencyDetailChange(index, currencyIndex, e),
                      error: getCurrencyError(currencyIndex, 'currencyType')
                    },
                      React.createElement('option', { value: '', disabled: true }, '-- Select --'),
                      currencies.map(c => React.createElement('option', { key: c, value: c }, c))
                  ),
                  React.createElement('div', null,
                    React.createElement('label', { htmlFor: `amountOffered-${index}-${currencyIndex}`, className: 'block text-sm font-medium text-slate-700' }, 'Amount Offered'),
                    React.createElement('input', { type: 'text', id: `amountOffered-${index}-${currencyIndex}`, name: 'amountOffered', value: detail.amountOffered, onChange: (e) => onCurrencyDetailChange(index, currencyIndex, e), placeholder: 'e.g., 5000', className: `mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm ${getCurrencyError(currencyIndex, 'amountOffered') ? 'border-red-500' : 'border-slate-300'}` }),
                    getCurrencyError(currencyIndex, 'amountOffered') && React.createElement('p', { className: 'mt-1 text-xs text-red-600' }, getCurrencyError(currencyIndex, 'amountOffered'))
                  ),
                  React.createElement('div', null,
                    React.createElement('label', { htmlFor: `currencyNumber-${index}-${currencyIndex}`, className: 'block text-sm font-medium text-slate-700' }, 'Currency Number'),
                    React.createElement('input', { type: 'text', id: `currencyNumber-${index}-${currencyIndex}`, name: 'currencyNumber', value: detail.currencyNumber, onChange: (e) => onCurrencyDetailChange(index, currencyIndex, e), placeholder: 'e.g., A12345678', className: `mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm ${getCurrencyError(currencyIndex, 'currencyNumber') ? 'border-red-500' : 'border-slate-300'}` }),
                    getCurrencyError(currencyIndex, 'currencyNumber') && React.createElement('p', { className: 'mt-1 text-xs text-red-600' }, getCurrencyError(currencyIndex, 'currencyNumber'))
                  )
                )
              )
            )),
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('button', { onClick: () => onAddCurrencyDetail(index), type: 'button', className: 'flex items-center px-4 py-2 text-sm bg-indigo-100 text-indigo-700 font-semibold rounded-lg shadow-sm hover:bg-indigo-200' }, React.createElement(PlusIcon), React.createElement('span', { className: 'ml-2' }, 'Add Currency Entry')),
              React.createElement('div', { className: 'flex items-center space-x-2' },
                React.createElement('input', { type: 'text', value: newCurrency, onChange: e => setNewCurrency(e.target.value), onKeyDown: (e) => handleKeyDown(e, handleAddCurrencyClick), placeholder: 'New type (e.g. CAD)', className: 'block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' }),
                React.createElement('button', { onClick: handleAddCurrencyClick, type: 'button', className: 'px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700' }, 'Add')
              )
            )
          )
        )
      ),
      React.createElement('div', { className: 'border-t border-slate-200 mt-6 pt-6' },
        React.createElement(SelectField, {
            label: 'Action Taken',
            id: `actionTaken-${index}`,
            name: 'actionTaken',
            value: offenderInfo.actionTaken,
            onChange: (e) => onChange(index, e),
            error: getError('actionTaken')
          },
          React.createElement('option', { value: '', disabled: true }, '-- Select an action --'),
          React.createElement('option', { value: 'impoundment' }, 'Impoundment'),
          React.createElement('option', { value: 'confiscation' }, 'Confiscation NDL'),
          React.createElement('option', { value: 'confiscation1' }, 'Confiscation VEH PAPER')
        )
      )
    )
  );
};