
import React from 'react';
import type { FormData, Offence, CurrencyDetail } from '../types';
import { OffenderInfoForm } from './PersonalInfoForm';
import { PlusIcon } from './icons/PlusIcon';

interface FormSectionProps {
  formData: FormData;
  onOffenderInfoChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onOffenceChange: (index: number, offenceName: string, isChecked: boolean) => void;
  onAddOffender: () => void;
  onRemoveOffender: (index: number) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  syncStatus: 'idle' | 'saving' | 'saved' | 'error';
  offences: Offence[];
  currencies: string[];
  onAddNewOffence: (offence: Offence) => void;
  onAddNewCurrency: (currency: string) => void;
  onCurrencyDetailChange: (offenderIndex: number, currencyIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAddCurrencyDetail: (offenderIndex: number) => void;
  onRemoveCurrencyDetail: (offenderIndex: number, currencyId: number) => void;
  validationErrors: { [key: string]: string };
}

export const FormSection: React.FC<FormSectionProps> = ({
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
    <div className="space-y-8">
      {formData.offenders.map((offender, index) => (
        <OffenderInfoForm
          key={index}
          index={index}
          offenderInfo={offender}
          onChange={onOffenderInfoChange}
          onOffenceChange={onOffenceChange}
          offences={offences}
          currencies={currencies}
          onAddNewOffence={onAddNewOffence}
          onAddNewCurrency={onAddNewCurrency}
          onCurrencyDetailChange={onCurrencyDetailChange}
          onAddCurrencyDetail={onAddCurrencyDetail}
          onRemoveCurrencyDetail={onRemoveCurrencyDetail}
          onRemove={onRemoveOffender}
          showRemoveButton={formData.offenders.length > 1}
          isMultiForm={formData.offenders.length > 1}
          validationErrors={validationErrors}
        />
      ))}
       <div className="flex justify-start pt-4 border-t border-dashed">
        <button
          onClick={onAddOffender}
          className="flex items-center px-5 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg shadow-sm hover:bg-indigo-200 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Add another offender to this report"
        >
          <PlusIcon />
          <span className="ml-2">Add Another Offender</span>
        </button>
      </div>

      <div className="flex justify-end items-center pt-4 space-x-4">
        <div className="flex-grow">
          {hasValidationErrors && <p className="text-red-600 font-medium">Please review the highlighted fields.</p>}
        </div>
        <div className="text-sm text-slate-600">
          {syncStatus === 'saving' && <p className="animate-pulse">Saving...</p>}
          {syncStatus === 'saved' && <p className="text-green-600 font-medium">Draft saved locally</p>}
          {syncStatus === 'error' && <p className="text-red-600 font-medium">Error saving draft</p>}
          {syncStatus === 'idle' && hasContent && <p>Unsaved changes</p>}
        </div>
        <button
          onClick={onSaveDraft}
          className="px-6 py-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          aria-label="Save current form as a draft"
        >
          Save Draft
        </button>
        <button
          onClick={onSubmit}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          aria-label="Submit new report"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};