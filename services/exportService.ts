
const actionTakenMap = {
  impoundment: 'Impoundment',
  confiscation: 'Confiscation NDL',
  confiscation1: 'Confiscation VEH PAPER',
};

const getActionTakenDisplay = (value) => actionTakenMap[value] || value;

const generateDocHtml = (reports, selectedColumns, offences) => {
  const offenceNameToCodeMap = new Map(offences.map(o => [o.name, o.code]));
  
  const reportsHtml = reports.map(report => {
    const reportHeaderRows = [
      selectedColumns.dateOfEntry && `<tr><td>Date of Entry</td><td>${report.dateOfEntry}</td></tr>`,
      selectedColumns.route && `<tr><td>Route</td><td>${report.route}</td></tr>`,
      selectedColumns.teamLeader && `<tr><td>Team Leader</td><td>${report.teamLeader}</td></tr>`,
      selectedColumns.teamLeaderPin && `<tr><td>Team Leader PIN</td><td>${report.teamLeaderPin}</td></tr>`,
    ].filter(Boolean).join('');

    const offenderRowsCombined = report.formData.offenders.map((offenderInfo, index) => {
      
      const currencyDetailsHtml = offenderInfo.offence.includes('ATTEMPTING TO CORRUPT MARSHAL') && offenderInfo.currencyDetails.length > 0
        ? `<tr>
             <td class="sub-header" colspan="2">Currency Offered Details:</td>
           </tr>
           <tr>
             <td colspan="2">
               <ul style="margin: 0; padding-left: 20px;">
                 ${offenderInfo.currencyDetails.map(detail => {
                    const parts = [];
                    if (selectedColumns.currencyType) parts.push(`Type: ${detail.currencyType}`);
                    if (selectedColumns.amountOffered) parts.push(`Amount: ${detail.amountOffered}`);
                    if (selectedColumns.currencyNumber) parts.push(`Number: ${detail.currencyNumber}`);
                    return `<li>${parts.join(' | ')}</li>`;
                 }).join('')}
               </ul>
             </td>
           </tr>`
        : '';
      
      const offenceCodes = offenderInfo.offence.map(name => offenceNameToCodeMap.get(name) || name).join(', ');

      const offenderRows = [
        selectedColumns.fullName && `<tr><td>Offender Name</td><td>${offenderInfo.fullName}</td></tr>`,
        selectedColumns.ticket && `<tr><td>Ticket Number</td><td>${offenderInfo.ticket}</td></tr>`,
        selectedColumns.vehicleNumberPlate && `<tr><td>Vehicle Number Plate</td><td>${offenderInfo.vehicleNumberPlate}</td></tr>`,
        selectedColumns.vehicleColor && `<tr><td>Vehicle Color</td><td>${offenderInfo.vehicleColor}</td></tr>`,
        selectedColumns.vehicleMake && `<tr><td>Vehicle Make</td><td>${offenderInfo.vehicleMake}</td></tr>`,
        selectedColumns.vehicleType && `<tr><td>Vehicle Type</td><td>${offenderInfo.vehicleType}</td></tr>`,
        selectedColumns.vehicleCategory && `<tr><td>Vehicle Category</td><td>${offenderInfo.vehicleCategory}</td></tr>`,
        selectedColumns.offence && `<tr><td>Offence(s)</td><td>${offenceCodes}</td></tr>`,
        selectedColumns.actionTaken && `<tr><td>Action Taken</td><td>${getActionTakenDisplay(offenderInfo.actionTaken)}</td></tr>`,
        currencyDetailsHtml,
      ].filter(Boolean).join('');
      
      const offenderHeader = report.formData.offenders.length > 1 ? `<tr class="section-header"><td colspan="2">Offender #${index + 1} Details</td></tr>` : '';

      return `${offenderHeader}${offenderRows}`;
    }).join('');

    return `
      <div class="report-container">
        <table class="report-table">
          <tr class="section-header"><td colspan="2">Report Details (ID: ${report.id})</td></tr>
          ${reportHeaderRows}
          ${offenderRowsCombined}
        </table>
      </div>
    `;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>FRSC Operations Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        h1 { text-align: center; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .report-container { 
          page-break-inside: avoid;
          margin-bottom: 25px; 
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ccc; 
        }
        td {
          padding: 8px 12px;
          border: 1px solid #ddd;
          text-align: left;
          vertical-align: top;
        }
        td:first-child:not(.sub-header) {
          font-weight: bold;
          width: 30%;
          background-color: #f9f9f9;
        }
        .section-header td {
          background-color: #e2e8f0;
          font-weight: bold;
          font-size: 1.1em;
          color: #2d3748;
        }
        .sub-header {
          font-weight: bold;
          background-color: #f7fafc;
        }
      </style>
    </head>
    <body>
      <h1>FRSC Operations Report</h1>
      ${reportsHtml}
    </body>
    </html>
  `;
};


const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToDoc = (reports, selectedColumns, offences) => {
  if (reports.length === 0) return;
  const htmlContent = generateDocHtml(reports, selectedColumns, offences);
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const filename = `FRSC_Reports_${new Date().toISOString().slice(0,10)}.doc`;
  triggerDownload(blob, filename);
};

const convertToCSV = (reports, selectedColumns, offences) => {
    const offenceNameToCodeMap = new Map(offences.map(o => [o.name, o.code]));
    const orderedReportFields = [
      'dateOfEntry', 'route', 'teamLeader', 'teamLeaderPin', 'fullName', 'ticket', 'offence', 'actionTaken', 
      'currencyType', 'amountOffered', 'currencyNumber', 'vehicleNumberPlate', 'vehicleColor', 
      'vehicleMake', 'vehicleType', 'vehicleCategory'
    ];

    const fieldsToExport = orderedReportFields.filter(field => selectedColumns[field]);
    
    const csvRows = [];

    reports.forEach(report => {
        report.formData.offenders.forEach(offenderInfo => {
            const hasAcs = offenderInfo.offence.includes('ATTEMPTING TO CORRUPT MARSHAL');
            const currencyDetails = hasAcs && offenderInfo.currencyDetails.length > 0 ? offenderInfo.currencyDetails : [{}];

            currencyDetails.forEach(currency => {
                const rowData = fieldsToExport.map(field => {
                    let value = '';
                    switch(field) {
                        case 'dateOfEntry': value = report.dateOfEntry; break;
                        case 'route': value = report.route; break;
                        case 'teamLeader': value = report.teamLeader; break;
                        case 'teamLeaderPin': value = report.teamLeaderPin; break;
                        case 'fullName': value = offenderInfo.fullName; break;
                        case 'ticket': value = offenderInfo.ticket; break;
                        case 'offence': value = offenderInfo.offence.map(name => offenceNameToCodeMap.get(name) || name).join('; '); break;
                        case 'actionTaken': value = getActionTakenDisplay(offenderInfo.actionTaken); break;
                        case 'currencyType': value = hasAcs ? currency.currencyType : ''; break;
                        case 'amountOffered': value = hasAcs ? currency.amountOffered : ''; break;
                        case 'currencyNumber': value = hasAcs ? currency.currencyNumber : ''; break;
                        case 'vehicleNumberPlate': value = offenderInfo.vehicleNumberPlate; break;
                        case 'vehicleColor': value = offenderInfo.vehicleColor; break;
                        case 'vehicleMake': value = offenderInfo.vehicleMake; break;
                        case 'vehicleType': value = offenderInfo.vehicleType; break;
                        case 'vehicleCategory': value = offenderInfo.vehicleCategory; break;
                    }
                    value = value || '';
                    return `"${String(value).replace(/"/g, '""')}"`;
                });
                csvRows.push(rowData.join(','));
            });
        });
    });

    return csvRows.join('\n');
};

export const exportToXls = (reports, selectedColumns, offences) => {
  if (reports.length === 0) return;
  const csvContent = convertToCSV(reports, selectedColumns, offences);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `FRSC_Reports_${new Date().toISOString().slice(0,10)}.xls`;
  triggerDownload(blob, filename);
};
