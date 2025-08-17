
import React, { useState, useMemo } from 'react';
import type { Report, OffenderInfo, CurrencyDetail, Offence } from '../types';

interface ReportsListProps {
  reports: Report[];
  offences: Offence[];
}

const actionTakenMap: { [key: string]: string } = {
  impoundment: 'Impoundment',
  confiscation: 'Confiscation NDL',
  confiscation1: 'Confiscation VEH PAPER',
};

const getActionTakenDisplay = (value: string) => actionTakenMap[value] || value;

type OffenderDataField = keyof OffenderInfo | 'currencyType' | 'amountOffered' | 'currencyNumber';

export const ReportsList: React.FC<ReportsListProps> = ({ reports, offences }) => {
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

  const renderMultiOffenderData = (report: Report, field: OffenderDataField) => {
    return report.formData.offenders.map(offender => {
        if (field === 'actionTaken') return getActionTakenDisplay(offender.actionTaken);
        if (field === 'offence') return offender.offence.map(name => offenceNameToCodeMap.get(name) || name).join('; ');

        if (['currencyType', 'amountOffered', 'currencyNumber'].includes(field)) {
            if (offender.offence.includes('ATTEMPTING TO CORRUPT MARSHAL') && offender.currencyDetails.length > 0) {
                return offender.currencyDetails.map(detail => detail[field as keyof CurrencyDetail]).join('; ');
            }
            return 'N/A';
        }
        
        const offenderField = field as keyof OffenderInfo;
        const value = offender[offenderField];

        if(Array.isArray(value)) return value.join('; ')
        
        return value || 'N/A';
    }).join(', ');
  };
  
  if (reports.length === 0) {
    return (
        <div className="text-center py-12 mt-12 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-slate-700">No reports submitted yet.</h3>
            <p className="text-sm text-slate-500">Fill out and submit the form to see reports here.</p>
        </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Submitted Reports</h2>
        <div className="flex items-center space-x-2">
            <label htmlFor="start-date" className="text-sm font-medium text-slate-700">From:</label>
            <input 
              type="date"
              id="start-date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="block w-full text-sm rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <label htmlFor="end-date" className="text-sm font-medium text-slate-700">To:</label>
             <input 
              type="date"
              id="end-date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="block w-full text-sm rounded-md border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date of Entry</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Route</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team Leader</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team Leader PIN</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ticket Number(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Offence Code(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action(s) Taken</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Currency Type(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount(s) Offered</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Currency Number(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle Plate(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle Color(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle Make(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle Type(s)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle Category(s)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredAndSortedReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.dateOfEntry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{report.teamLeader}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.teamLeaderPin}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'fullName')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'ticket')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'offence')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'actionTaken')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'currencyType')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'amountOffered')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'currencyNumber')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'vehicleNumberPlate')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'vehicleColor')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'vehicleMake')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'vehicleType')}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-slate-500">{renderMultiOffenderData(report, 'vehicleCategory')}</td>
                </tr>
              ))}
              {filteredAndSortedReports.length === 0 && (
                <tr>
                  <td colSpan={16} className="text-center py-10 text-slate-500">
                    No reports match your selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};