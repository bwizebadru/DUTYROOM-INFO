
import React, { useState } from 'react';
import type { OffenderInfo, Offence, CurrencyDetail } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';


interface OffenderInfoFormProps {
  offenderInfo: OffenderInfo;
  index: number;
  isMultiForm: boolean;
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onOffenceChange: (index: number, offenceName: string, isChecked: boolean) => void;
  offences: Offence[];
  currencies: string[];
  onAddNewOffence: (offence: Offence) => void;
  onAddNewCurrency: (currency: string) => void;
  onCurrencyDetailChange: (offenderIndex: number, currencyIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAddCurrencyDetail: (offenderIndex: number) => void;
  onRemoveCurrencyDetail: (offenderIndex: number, currencyId: number) => void;
  onRemove: (index: number) => void;
  showRemoveButton: boolean;
  validationErrors: { [key: string]: string };
}

const InputField: React.FC<{ name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; label: string; type?: string; placeholder?: string }> = ({ label, name, value, onChange, type = 'text', placeholder, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${error ? 'border-red-500' : 'border-slate-300'}`}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export const OffenderInfoForm: React.FC<OffenderInfoFormProps> = ({ 
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

  const getError = (fieldName: string) => validationErrors[`offender-${index}-${fieldName}`];
  const getCurrencyError = (currencyIndex: number, fieldName: string) => validationErrors[`offender-${index}-currency-${currencyIndex}-${fieldName}`];

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, callback: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md relative border border-slate-200">
      {showRemoveButton && (
         <button 
            onClick={() => onRemove(index)} 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label={`Remove Offender #${index + 1}`}
        >
          <TrashIcon />
        </button>
      )}
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 mb-6">
        Offender Information {isMultiForm ? ` #${index + 1}`: ''}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InputField label="Full Name" name="fullName" value={offenderInfo.fullName} onChange={(e) => onChange(index, e)} placeholder="John Doe" error={getError('fullName')} />
        <InputField label="Ticket Number" name="ticket" value={offenderInfo.ticket} onChange={(e) => onChange(index, e)} type="text" placeholder="0011D1A09999" error={getError('ticket')} />
        <InputField label="Vehicle Number Plate" name="vehicleNumberPlate" value={offenderInfo.vehicleNumberPlate} onChange={(e) => onChange(index, e)} placeholder="ABC-123-XYZ" error={getError('vehicleNumberPlate')} />
        <InputField label="Vehicle Color" name="vehicleColor" value={offenderInfo.vehicleColor} onChange={(e) => onChange(index, e)} placeholder="Red" error={getError('vehicleColor')} />
        <InputField label="Vehicle Make" name="vehicleMake" value={offenderInfo.vehicleMake} onChange={(e) => onChange(index, e)} placeholder="Toyota" error={getError('vehicleMake')} />
        <InputField label="Vehicle Type" name="vehicleType" value={offenderInfo.vehicleType} onChange={(e) => onChange(index, e)} placeholder="Sedan" error={getError('vehicleType')} />
        <div>
          <label htmlFor={`vehicleCategory-${index}`} className="block text-sm font-medium text-slate-700">Vehicle Category</label>
          <select
            id={`vehicleCategory-${index}`}
            name="vehicleCategory"
            value={offenderInfo.vehicleCategory}
            onChange={(e) => onChange(index, e)}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${getError('vehicleCategory') ? 'border-red-500' : 'border-slate-300'}`}
          >
            <option value="" disabled>-- Select a category --</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Pickup">Pickup</option>
            <option value="Bus">Bus</option>
            <option value="Car">Car</option>
            <option value="Jeep">Jeep</option>
            <option value="Truck">Truck</option>
            <option value="Articulated">Articulated</option>
            <option value="Tanker">Tanker</option>
          </select>
          {getError('vehicleCategory') && <p className="mt-1 text-xs text-red-600">{getError('vehicleCategory')}</p>}
        </div>
      </div>

      <div className="border-t border-slate-200 mt-6 pt-6">
        <label className="block text-sm font-medium text-slate-700">Offence(s)</label>
        <div className={`mt-2 space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-slate-50 ${getError('offence') ? 'border-red-500' : 'border-slate-200'}`}>
          {offences.map(offence => (
            <div key={offence.code} className="flex items-center">
              <input
                id={`offence-${index}-${offence.code}`}
                name="offence"
                type="checkbox"
                checked={offenderInfo.offence.includes(offence.name)}
                onChange={(e) => onOffenceChange(index, offence.name, e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={`offence-${index}-${offence.code}`} className="ml-3 block text-sm text-slate-900">
                {`${offence.code} - ${offence.name}`}
              </label>
            </div>
          ))}
        </div>
        {getError('offence') && <p className="mt-1 text-xs text-red-600">{getError('offence')}</p>}
        <div className="mt-4">
          <p className="block text-sm font-medium text-slate-700">Add New Offence</p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <input type="text" name="newOffenceCode" value={newOffence.code} onChange={(e) => setNewOffence(prev => ({...prev, code: e.target.value}))} onKeyDown={(e) => handleKeyDown(e, handleAddOffenceClick)} placeholder="Code" className="sm:col-span-1 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <input type="text" name="newOffenceName" value={newOffence.name} onChange={(e) => setNewOffence(prev => ({...prev, name: e.target.value}))} onKeyDown={(e) => handleKeyDown(e, handleAddOffenceClick)} placeholder="e.g., Illegal Parking" className="sm:col-span-3 block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            <button onClick={handleAddOffenceClick} type="button" className="sm:col-span-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add</button>
          </div>
        </div>
      </div>

      {isAcsSelected && (
        <div className="border-t border-slate-200 mt-6 pt-6 bg-amber-50 p-4 rounded-md">
          <h3 className="text-md font-semibold text-slate-800 mb-4">Currency Offered Details (ACS)</h3>
          <div className="space-y-4">
            {offenderInfo.currencyDetails.map((detail, currencyIndex) => (
              <div key={detail.id} className="p-3 border border-amber-200 rounded-lg bg-white relative">
                {offenderInfo.currencyDetails.length > 1 && (
                    <button onClick={() => onRemoveCurrencyDetail(index, detail.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600" aria-label="Remove currency entry"><TrashIcon /></button>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor={`currencyType-${index}-${currencyIndex}`} className="block text-sm font-medium text-slate-700">Currency Type</label>
                    <select id={`currencyType-${index}-${currencyIndex}`} name="currencyType" value={detail.currencyType} onChange={(e) => onCurrencyDetailChange(index, currencyIndex, e)} className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${getCurrencyError(currencyIndex, 'currencyType') ? 'border-red-500' : 'border-slate-300'}`}>
                      <option value="" disabled>-- Select --</option>
                      {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {getCurrencyError(currencyIndex, 'currencyType') && <p className="mt-1 text-xs text-red-600">{getCurrencyError(currencyIndex, 'currencyType')}</p>}
                  </div>
                  <div>
                    <label htmlFor={`amountOffered-${index}-${currencyIndex}`} className="block text-sm font-medium text-slate-700">Amount Offered</label>
                    <input type="text" id={`amountOffered-${index}-${currencyIndex}`} name="amountOffered" value={detail.amountOffered} onChange={(e) => onCurrencyDetailChange(index, currencyIndex, e)} placeholder="e.g., 5000" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm ${getCurrencyError(currencyIndex, 'amountOffered') ? 'border-red-500' : 'border-slate-300'}`} />
                    {getCurrencyError(currencyIndex, 'amountOffered') && <p className="mt-1 text-xs text-red-600">{getCurrencyError(currencyIndex, 'amountOffered')}</p>}
                  </div>
                  <div>
                    <label htmlFor={`currencyNumber-${index}-${currencyIndex}`} className="block text-sm font-medium text-slate-700">Currency Number</label>
                    <input type="text" id={`currencyNumber-${index}-${currencyIndex}`} name="currencyNumber" value={detail.currencyNumber} onChange={(e) => onCurrencyDetailChange(index, currencyIndex, e)} placeholder="e.g., A12345678" className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm ${getCurrencyError(currencyIndex, 'currencyNumber') ? 'border-red-500' : 'border-slate-300'}`} />
                    {getCurrencyError(currencyIndex, 'currencyNumber') && <p className="mt-1 text-xs text-red-600">{getCurrencyError(currencyIndex, 'currencyNumber')}</p>}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
                <button onClick={() => onAddCurrencyDetail(index)} type="button" className="flex items-center px-4 py-2 text-sm bg-indigo-100 text-indigo-700 font-semibold rounded-lg shadow-sm hover:bg-indigo-200"><PlusIcon /><span className="ml-2">Add Currency Entry</span></button>
                <div className="flex items-center space-x-2">
                    <input type="text" value={newCurrency} onChange={e => setNewCurrency(e.target.value)} onKeyDown={(e) => handleKeyDown(e, handleAddCurrencyClick)} placeholder="New type (e.g. CAD)" className="block w-full rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <button onClick={handleAddCurrencyClick} type="button" className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Add</button>
                </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-slate-200 mt-6 pt-6">
        <label htmlFor={`actionTaken-${index}`} className="block text-sm font-medium text-slate-700">Action Taken</label>
        <select
          id={`actionTaken-${index}`}
          name="actionTaken"
          value={offenderInfo.actionTaken}
          onChange={(e) => onChange(index, e)}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${getError('actionTaken') ? 'border-red-500' : 'border-slate-300'}`}
        >
          <option value="" disabled>-- Select an action --</option>
          <option value="impoundment">Impoundment</option>
          <option value="confiscation">Confiscation NDL</option>
          <option value="confiscation1">Confiscation VEH PAPER</option>
        </select>
        {getError('actionTaken') && <p className="mt-1 text-xs text-red-600">{getError('actionTaken')}</p>}
      </div>
    </div>
  );
};
