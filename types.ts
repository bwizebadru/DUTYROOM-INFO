
export interface CurrencyDetail {
  id: number;
  currencyType: string;
  amountOffered: string;
  currencyNumber: string;
}

export interface OffenderInfo {
  fullName: string;
  ticket: string;
  vehicleNumberPlate: string;
  vehicleColor: string;
  vehicleMake: string;
  vehicleType: string;
  vehicleCategory: string;
  offence: string[];
  actionTaken: string;
  currencyDetails: CurrencyDetail[];
}

export interface FormData {
  offenders: OffenderInfo[];
}

export interface TeamLeader {
  name: string;
  pin: string;
}

export interface Offence {
  code: string;
  name: string;
}

export interface Report {
  id: number;
  teamLeader: string;
  teamLeaderPin: string;
  dateOfEntry: string;
  route: string;
  formData: FormData;
  submissionTimestamp: number;
}

export type ReportField = 
  | 'dateOfEntry'
  | 'route'
  | 'teamLeader'
  | 'teamLeaderPin'
  | 'fullName'
  | 'ticket'
  | 'offence'
  | 'actionTaken'
  | 'amountOffered'
  | 'currencyNumber'
  | 'currencyType'
  | 'vehicleNumberPlate'
  | 'vehicleColor'
  | 'vehicleMake'
  | 'vehicleType'
  | 'vehicleCategory';

export type ExportColumns = Record<ReportField, boolean>;


export interface WorkExperience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description:string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface Skill {
  id: number;
  name: string;
}