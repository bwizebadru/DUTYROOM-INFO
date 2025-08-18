

import React from 'react';
import { OffenderInfoForm } from './PersonalInfoForm.js';
import { PlusIcon } from './icons/PlusIcon.js';

export const FormSection = ({
  formData,
  onOffenderInfoChange,
  onOffenceChange,
  onAddOffender,
  onRemoveOffender,
  onSaveDraft,
  onSubmit,
  syncStatus,
  offences,
  currencies,
  onAddNewOffence,
  onAddNewCurrency,
  onCurrencyDetailChange,
  onAddCurrencyDetail,
  onRemoveCurrencyDetail,
  validationErrors,
}) => {
  const hasContent = formData.offenders.some(offender =>
    offender.fullName || offender.ticket || offender.vehicleNumberPlate ||
    offender.vehicleColor || offender.vehicleType || offender.vehicleMake ||
    offender.vehicleCategory || offender.offence.length > 0 ||
    offender.actionTaken || offender.currencyDetails.some(c => c.amountOffered || c.currencyNumber || c.currencyType)
  );

  const hasValidationErrors = Object.keys(validationErrors).some(key => key.startsWith('offender-'));

  return (
    React.createElement('div', { className: 'space-y-8' },
      formData.offenders.map((offender, index) =>
        React.createElement(OffenderInfoForm, {
          key: index,
          index: index,
          offenderInfo: offender,
          onChange: onOffenderInfoChange,
          onOffenceChange: onOffenceChange,
          offences: offences,
          currencies: currencies,
          onAddNewOffence: onAddNewOffence,
          onAddNewCurrency: onAddNewCurrency,
          onCurrencyDetailChange: onCurrencyDetailChange,
          onAddCurrencyDetail: onAddCurrencyDetail,
          onRemoveCurrencyDetail: onRemoveCurrencyDetail,
          onRemove: onRemoveOffender,
          showRemoveButton: formData.offenders.length > 1,
          isMultiForm: formData.offenders.length > 1,
          validationErrors: validationErrors,
        })
      ),
      React.createElement('div', { className: 'flex justify-start pt-4 border-t border-dashed' },
        React.createElement('button', {
          onClick: onAddOffender,
          className: 'flex items-center px-5 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow-sm hover:bg-blue-200 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'aria-label': 'Add another offender to this report'
        },
          React.createElement(PlusIcon),
          React.createElement('span', { className: 'ml-2' }, 'Add Another Offender')
        )
      ),
      React.createElement('div', { className: 'flex justify-end items-center pt-4 space-x-4' },
        React.createElement('div', { className: 'flex-grow' },
          hasValidationErrors && React.createElement('p', { className: 'text-red-600 font-medium' }, 'Please review the highlighted fields.')
        ),
        React.createElement('div', { className: 'text-sm text-slate-600' },
          syncStatus === 'saving' && React.createElement('p', { className: 'animate-pulse' }, 'Saving...'),
          syncStatus === 'saved' && React.createElement('p', { className: 'text-blue-600 font-medium' }, 'Draft saved locally'),
          syncStatus === 'error' && React.createElement('p', { className: 'text-red-600 font-medium' }, 'Error saving draft'),
          syncStatus === 'idle' && hasContent && React.createElement('p', null, 'Unsaved changes')
        ),
        React.createElement('button', {
          onClick: onSaveDraft,
          className: 'px-6 py-3 bg-[#99ccff] text-blue-900 font-bold rounded-lg shadow-md hover:bg-[#60a5fa] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99ccff]',
          'aria-label': 'Save current form as a draft'
        }, 'Save Draft'),
        React.createElement('button', {
          onClick: onSubmit,
          className: 'px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600',
          'aria-label': 'Submit new report'
        }, 'Submit Report')
      )
    )
  );
};