

const DRAFT_KEY = 'frsc-form-draft';
const REPORTS_KEY = 'frsc-submitted-reports';

// --- Draft Management ---

export const saveDraft = (formData) => {
  try {
    const serializedData = JSON.stringify(formData);
    localStorage.setItem(DRAFT_KEY, serializedData);
  } catch (error) {
    console.error("Could not save draft to local storage", error);
    throw error;
  }
};

export const loadDraft = () => {
  try {
    const serializedData = localStorage.getItem(DRAFT_KEY);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Could not load draft from local storage", error);
    return null;
  }
};

export const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY);
};


// --- "Online" Report Storage Simulation ---

export const saveReportOnline = (report) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      try {
        const existingReports = loadReportsOnline();
        const updatedReports = [...existingReports, report];
        localStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
        resolve();
      } catch (error) {
        console.error("Failed to save report 'online'", error);
        reject(error);
      }
    }, 1000); // Simulate 1 second network latency
  });
};

export const loadReportsOnline = () => {
  try {
    const serializedData = localStorage.getItem(REPORTS_KEY);
    if (serializedData === null) {
      return [];
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Could not load reports from 'online' storage", error);
    return [];
  }
};