

import React, { useState, useEffect } from 'react';
import { FormSection } from './FormSection.js';
import { ExportSection } from './ExportSection.js';
import { TeamLeaderSelection } from './AttendantSelection.js';
import { ReportsList } from './ReportsList.js';
import { frscLogoBase64 } from '../assets/logo.js';
import { saveDraft, loadDraft, clearDraft, saveReportOnline, loadReportsOnline } from '../services/storageService.js';

const createInitialOffender = () => ({
  fullName: '',
  ticket: '',
  vehicleNumberPlate: '',
  vehicleColor: '',
  vehicleMake: '',
  vehicleType: '',
  vehicleCategory: '',
  offence: [],
  actionTaken: '',
  currencyDetails: [],
});

const createInitialFormData = () => {
  return {
    offenders: [createInitialOffender()],
  };
};

const initialTeamLeaders = [
  { name: 'RC OS ODEKUNLE', pin: 'C-07287' },
  { name: 'RC CT BOYEDE', pin: 'C-07716' },
  { name: 'DRC TO OKUNOYE', pin: 'C-08653' },
  { name: 'DRC D ADEGOKE', pin: 'C-08925' },
  { name: 'DRC DO OLAGOKE', pin: 'C-09040' },
  { name: 'DRC MO OGUBOWALE', pin: 'C-011416' },
  { name: 'DRC SA ADEBIYI', pin: 'C-09173' },
  { name: 'DRC VO JEGEDE', pin: 'C-09940' },
  { name: 'ARC JT OGUNDELE', pin: 'C-010655' },
  { name: 'ARC MA BADRU', pin: 'C-010690' },
  { name: 'ARC OO OLASANMI', pin: 'C-010823' },
  { name: 'ARC BF OSHODI', pin: 'C-011813' },
  { name: 'ARC AO ADEGUN', pin: 'C-011907' },
  { name: 'ARC BJ OWOEYE', pin: 'C-012236' },
];

const initialRoutes = ['OS - SEKONA', 'OS - IKIRUN', 'OS - IWO/EJIGBO', 'OS - ILESA'];
const initialOffences = [
  { code: 'SUV', name: 'SEAT BELT VIOLATION' },
  { code: 'RMH', name: 'RIDING MOTORCYCLE WITHOUT USING CRASH HELMET' },
  { code: 'TYV', name: 'DRIVING WITH WORN-OUT TYRE' },
  { code: 'EWT', name: 'DRIVING WITH EXPIRED/WITHOUT SPARE TYRE' },
  { code: 'OVL', name: 'OVERLOADING' },
  { code: 'ACS', name: 'ATTEMPTING TO CORRUPT MARSHAL' },
  { code: 'DLV', name: 'DRIVER LICENCE VIOLATION' },
  { code: 'UPD', name: 'USE OF PHONE WHILE DRIVING' },
  { code: 'VLV', name: 'VEHICLE LICENCE VIOLATION' },
  { code: 'VMV', name: 'VEHICLE MIRROR VIOLATION' },
  { code: 'NPV', name: 'VEHICLE NUMBER PLATE VIOLATION' },
  { code: 'VWV', name: 'VEHICLE WINDSHIELD VIOLATION' },
  { code: 'SLD', name: 'FAILURE TO INSTALL SPEED LIMITING' },
  { code: 'FEV', name: 'FIRE EXTINGUISHER VIOLATION' },
  { code: 'LSV', name: 'LIGHT/SIGN VIOLATION' },
  { code: 'DGD', name: 'DANGEROUS DRIVING' },
  { code: 'AWV', name: 'ASCERTAINMENT OF WEIGHT VIOLATION' },
  { code: 'AMD', name: 'ASSAULTING MARSHAL ON DUTY' },
  { code: 'CSV', name: 'CAUTION SIGN VIOLATION' },
  { code: 'CRV', name: 'CHILD RESTRAINT VIOLATION' },
  { code: 'CPV', name: 'CHILD SITTING POSITION VIOLATION' },
  { code: 'DNM', name: 'DO NOT MOVE' },
  { code: 'DRV', name: 'DRIVING RIGHT-HAND STEERING' },
  { code: 'DUI', name: 'DRIVING UNDER ALCOHOL OR DRUG INFLUENCE' },
  { code: 'ESE', name: 'EXCESSIVE SMOKE EMISSION' },
  { code: 'FCM', name: 'FAILURE TO COVER UNSTABLE MATERIALS' },
  { code: 'FFF', name: 'FAILURE TO FIX RED FLAG ON PROJECTED LOAD' },
  { code: 'FMO', name: 'FAILURE TO MOVE OVER' },
  { code: 'OMD', name: 'OBSTRUCTING MARSHAL ON DUTY' },
  { code: 'MDV', name: 'OPERATING MECHANICALLY DEFICIENT VEHICLE' },
  { code: 'OFV', name: 'OTHER OFFENCES/VIOLATION' },
  { code: 'PLE', name: 'PROJECTED LOAD IN EXCESS OF PRESCRIBED LIMIT' },
  { code: 'RTV', name: 'ROUTE VIOLATION' },
  { code: 'SLV', name: 'SPEED LIMIT VIOLATION' },
  { code: 'UDR', name: 'UNDER AGE DRIVING/RIDING' },
  { code: 'WOV', name: 'WRONGFUL OVERTAKING' },  
];
const initialCurrencies = ['NGN', 'USD', 'EUR', 'GBP'];

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

export const Dashboard = ({ onSignOut }) => {
  const [formData, setFormData] = useState(createInitialFormData());
  const [reports, setReports] = useState([]);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
  const [teamLeaders, setTeamLeaders] = useState(initialTeamLeaders);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [dateOfEntry, setDateOfEntry] = useState(getTodayDateString());
  const [routes, setRoutes] = useState(initialRoutes);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [offences, setOffences] = useState(initialOffences);
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      setFormData(savedDraft);
      setSyncStatus('saved'); 
    }

    const onlineReports = loadReportsOnline();
    if (onlineReports.length > 0) {
      setReports(onlineReports);
    }
  }, []);

  const resetSyncStatus = () => {
    if (syncStatus === 'saved') {
      setSyncStatus('idle');
    }
  };

  const handleOffenderInfoChange = (index, e) => {
    resetSyncStatus();
    const { name, value } = e.target;
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`offender-${index}-${name}`];
      return newErrors;
    });

    setFormData(prev => {
      const newOffenders = [...prev.offenders];
      newOffenders[index] = { ...newOffenders[index], [name]: value };
      return { ...prev, offenders: newOffenders };
    });
  };

  const handleOffenceChange = (index, offenceName, isChecked) => {
    resetSyncStatus();
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`offender-${index}-offence`];
      return newErrors;
    });

    setFormData(prev => {
      const newOffenders = [...prev.offenders];
      const offender = newOffenders[index];
      const currentOffences = offender.offence;
      const newOffences = isChecked
        ? [...currentOffences, offenceName]
        : currentOffences.filter(o => o !== offenceName);
      
      const isAcsSelected = newOffences.includes('ATTEMPTING TO CORRUPT MARSHAL');
      
      let newCurrencyDetails = offender.currencyDetails;
      if (isAcsSelected && offender.currencyDetails.length === 0) {
        newCurrencyDetails = [{ id: Date.now(), currencyType: '', amountOffered: '', currencyNumber: '' }];
      } else if (!isAcsSelected) {
        newCurrencyDetails = [];
      }
      
      newOffenders[index] = {
        ...offender,
        offence: newOffences,
        currencyDetails: newCurrencyDetails,
      };

      return { ...prev, offenders: newOffenders };
    });
  };

  const handleCurrencyDetailChange = (offenderIndex, currencyIndex, e) => {
    resetSyncStatus();
    const { name, value } = e.target;
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`offender-${offenderIndex}-currency-${currencyIndex}-${name}`];
      return newErrors;
    });

    setFormData(prev => {
      const newOffenders = [...prev.offenders];
      const newCurrencyDetails = [...newOffenders[offenderIndex].currencyDetails];
      newCurrencyDetails[currencyIndex] = { ...newCurrencyDetails[currencyIndex], [name]: value };
      newOffenders[offenderIndex] = { ...newOffenders[offenderIndex], currencyDetails: newCurrencyDetails };
      return { ...prev, offenders: newOffenders };
    });
  };
  
  const handleAddCurrencyDetail = (offenderIndex) => {
    resetSyncStatus();
    setFormData(prev => {
        const newOffenders = [...prev.offenders];
        const newCurrencyDetails = [...newOffenders[offenderIndex].currencyDetails, { id: Date.now(), currencyType: '', amountOffered: '', currencyNumber: '' }];
        newOffenders[offenderIndex] = { ...newOffenders[offenderIndex], currencyDetails: newCurrencyDetails };
        return { ...prev, offenders: newOffenders };
    });
  };

  const handleRemoveCurrencyDetail = (offenderIndex, currencyId) => {
    resetSyncStatus();
    setFormData(prev => {
        const newOffenders = [...prev.offenders];
        const newCurrencyDetails = newOffenders[offenderIndex].currencyDetails.filter(detail => detail.id !== currencyId);
        newOffenders[offenderIndex] = { ...newOffenders[offenderIndex], currencyDetails: newCurrencyDetails };
        return { ...prev, offenders: newOffenders };
    });
  };
  
  const handleAddNewCurrency = (currency) => {
    if (currency && !currencies.includes(currency)) {
        setCurrencies(prev => [...prev, currency.toUpperCase()]);
    } else if (currencies.includes(currency)) {
        alert('This currency type already exists.');
    } else {
        alert('Please provide a name for the new currency type.');
    }
  };


  const handleDateChange = (e) => {
    setValidationErrors(prev => ({...prev, dateOfEntry: ''}));
    setDateOfEntry(e.target.value);
  };

  const handleTeamLeaderChange = (e) => {
    setValidationErrors(prev => ({...prev, selectedTeamLeader: ''}));
    setSelectedTeamLeader(e.target.value);
  };

  const handleRouteChange = (e) => {
    setValidationErrors(prev => ({...prev, selectedRoute: ''}));
    setSelectedRoute(e.target.value);
  };
  
  const handleAddOffender = () => {
    setFormData(prev => ({
        ...prev,
        offenders: [...prev.offenders, createInitialOffender()]
    }));
    resetSyncStatus();
  };

  const handleRemoveOffender = (index) => {
    if (formData.offenders.length <= 1) return;
    setFormData(prev => ({
        ...prev,
        offenders: prev.offenders.filter((_, i) => i !== index)
    }));
    resetSyncStatus();
  };

  const handleAddNewRoute = (route) => {
    if (route && !routes.includes(route)) {
      const newRoutes = [...routes, route];
      setRoutes(newRoutes);
      setSelectedRoute(route);
      setValidationErrors(prev => ({...prev, selectedRoute: ''}));
    } else if (routes.includes(route)) {
      alert('This route already exists.');
    } else {
        alert('Please provide a name for the new route.');
    }
  };

  const handleAddNewTeamLeader = (name, pin) => {
    if (name && pin && !teamLeaders.some(leader => leader.name === name)) {
      const newTeamLeaders = [...teamLeaders, { name, pin }];
      setTeamLeaders(newTeamLeaders);
      setSelectedTeamLeader(name);
      setValidationErrors(prev => ({...prev, selectedTeamLeader: ''}));
    } else if (teamLeaders.some(leader => leader.name === name)) {
      alert('A team leader with this name already exists.');
    } else {
        alert('Please provide both a name and a PIN for the new team leader.');
    }
  };
  
  const handleAddNewOffence = (offence) => {
    if (offence.name && offence.code && !offences.some(o => o.name === offence.name || o.code === offence.code)) {
      const newOffences = [...offences, offence];
      setOffences(newOffences);
      handleOffenceChange(formData.offenders.length - 1, offence.name, true);
    } else if (offences.some(o => o.name === offence.name)) {
      alert('An offence with this name already exists.');
    } else if (offences.some(o => o.code === offence.code)) {
      alert('An offence with this code already exists.');
    } else {
      alert('Please provide both a code and a name for the new offence.');
    }
  };

  const handleSaveDraft = () => {
    setSyncStatus('saving');
    try {
        saveDraft(formData);
        setTimeout(() => {
            setSyncStatus('saved');
        }, 700);
    } catch (e) {
        console.error("Failed to save draft", e);
        setSyncStatus('error');
    }
  };

  const handleSubmitForm = async () => {
    const newErrors: { [key: string]: string } = {};
    let isFormValid = true;

    if (!dateOfEntry) {
        newErrors.dateOfEntry = 'This field is required';
        isFormValid = false;
    }
    if (!selectedTeamLeader) {
        newErrors.selectedTeamLeader = 'This field is required';
        isFormValid = false;
    }
    if (!selectedRoute) {
        newErrors.selectedRoute = 'This field is required';
        isFormValid = false;
    }

    formData.offenders.forEach((offender, index) => {
        (Object.keys(offender)).forEach(key => {
            const fieldKey = `offender-${index}-${key}`;
            if (key === 'offence') {
                if (offender.offence.length === 0) {
                    newErrors[fieldKey] = 'This field is required';
                    isFormValid = false;
                }
            } else if (key === 'currencyDetails') {
                if (offender.offence.includes('ATTEMPTING TO CORRUPT MARSHAL')) {
                    if (offender.currencyDetails.length === 0) {
                        isFormValid = false; 
                    }
                    offender.currencyDetails.forEach((detail, currencyIndex) => {
                        if (!detail.currencyType.trim()) {
                            newErrors[`offender-${index}-currency-${currencyIndex}-currencyType`] = 'This field is required';
                            isFormValid = false;
                        }
                        if (!detail.amountOffered.trim()) {
                            newErrors[`offender-${index}-currency-${currencyIndex}-amountOffered`] = 'This field is required';
                            isFormValid = false;
                        }
                        if (!detail.currencyNumber.trim()) {
                            newErrors[`offender-${index}-currency-${currencyIndex}-currencyNumber`] = 'This field is required';
                            isFormValid = false;
                        }
                    });
                }
            } else if (typeof offender[key] === 'string' && !(offender[key]).trim()) {
                newErrors[fieldKey] = 'This field is required';
                isFormValid = false;
            }
        });
    });

    setValidationErrors(newErrors);

    if (!isFormValid) {
        return;
    }
    
    const selectedLeader = teamLeaders.find(leader => leader.name === selectedTeamLeader);

    const newReport = {
      id: Date.now(),
      submissionTimestamp: Date.now(),
      teamLeader: selectedTeamLeader,
      teamLeaderPin: selectedLeader?.pin || '',
      dateOfEntry: dateOfEntry,
      route: selectedRoute,
      formData: formData,
    };

    setReports(prev => [...prev, newReport]);
    setFormData(createInitialFormData());
    clearDraft();
    setSyncStatus('idle');

    try {
        await saveReportOnline(newReport);
    } catch (error) {
        alert("There was an issue saving the report online. It is available for this session only.");
    }
  };
  
  const selectedLeaderObject = teamLeaders.find(leader => leader.name === selectedTeamLeader);
  const selectedTeamLeaderPin = selectedLeaderObject ? selectedLeaderObject.pin : '';

  return (
    React.createElement('div', { className: 'container mx-auto p-4 sm:p-6 lg:p-8' },
      React.createElement('header', { className: 'text-center mb-10 flex flex-col items-center relative' },
        React.createElement('img', { src: frscLogoBase64, alt: 'FRSC Logo', className: 'h-24 w-auto mb-4' }),
        React.createElement('h1', { className: 'text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight' }, 'FRSC OPERATIONS E-DASHBOARD'),
        React.createElement('p', { className: 'mt-2 text-lg text-slate-600' }, 'Fill in the details below and export your data effortlessly.'),
        React.createElement('button', {
          onClick: onSignOut,
          className: 'absolute top-0 right-0 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400',
          'aria-label': 'Sign out of the application'
        }, 'Sign Out')
      ),
      React.createElement('main', null,
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-5 gap-8' },
          React.createElement('div', { className: 'lg:col-span-3' },
            React.createElement(TeamLeaderSelection, {
              teamLeaders: teamLeaders,
              selectedTeamLeader: selectedTeamLeader,
              selectedTeamLeaderPin: selectedTeamLeaderPin,
              onTeamLeaderChange: handleTeamLeaderChange,
              onAddNewTeamLeader: handleAddNewTeamLeader,
              dateOfEntry: dateOfEntry,
              onDateChange: handleDateChange,
              routes: routes,
              selectedRoute: selectedRoute,
              onRouteChange: handleRouteChange,
              onAddNewRoute: handleAddNewRoute,
              validationErrors: validationErrors,
            }),
            React.createElement(FormSection, {
              formData: formData,
              onOffenderInfoChange: handleOffenderInfoChange,
              onOffenceChange: handleOffenceChange,
              onAddOffender: handleAddOffender,
              onRemoveOffender: handleRemoveOffender,
              onSubmit: handleSubmitForm,
              onSaveDraft: handleSaveDraft,
              syncStatus: syncStatus,
              offences: offences,
              currencies: currencies,
              onAddNewOffence: handleAddNewOffence,
              onAddNewCurrency: handleAddNewCurrency,
              onCurrencyDetailChange: handleCurrencyDetailChange,
              onAddCurrencyDetail: handleAddCurrencyDetail,
              onRemoveCurrencyDetail: handleRemoveCurrencyDetail,
              validationErrors: validationErrors,
            })
          ),
          React.createElement('div', { className: 'lg:col-span-2' },
            React.createElement(ExportSection, { reports: reports, offences: offences })
          )
        ),
        React.createElement(ReportsList, { reports: reports, offences: offences })
      ),
      React.createElement('footer', { className: 'text-center mt-12 text-slate-500' },
        React.createElement('p', null, `© ${new Date().getFullYear()} FRSC OPERATIONS E-DASHBOARD. All rights reserved.`)
      )
    )
  );
};