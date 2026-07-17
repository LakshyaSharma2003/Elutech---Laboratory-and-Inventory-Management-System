export interface Sample {
  id: number;
  requestId?: number;
  sampleCode: string;
  sampleName: string;
  sampleType: 'Government' | 'Private' | string;

  customerId?: number;
  customerOrBranchName?: string;
  customerOrBranchAddress?: string;

  employee: string;
  assignedEmployeeId: number;
  currentPhase: string;
  status: string;

  dateArrived?: string;
  isNumber?: string;
  typeOfTest?: string;
  sampleSize?: string;
  generatedCode?: string;
  processStartDate?: string;
  completionDate?: string;
  conditionOnReceiving?: string;
  otherRemarks?: string;

  acceptanceStatus: 'Pending' | 'Accepted' | 'Rejected' | string;
  rejectionRemarks?: string;
  expectedCompletionDate?: string;
  progressPercent: number;
}

export interface AddSample {
  sampleName: string;
  sampleType: 'Government' | 'Private';
  customerId?: number;
  branchName?: string;
  branchAddress?: string;
  assignedEmployeeId: number;
  dateArrived?: string;
  isNumber?: string;
  typeOfTest?: string;
  sampleSize?: string;
  conditionOnReceiving?: string;
  otherRemarks?: string;
}

export interface UpdateSampleDetails {
  dateArrived?: string;
  isNumber?: string;
  typeOfTest?: string;
  sampleSize?: string;
  generatedCode?: string;
  processStartDate?: string;
  completionDate?: string;
  conditionOnReceiving?: string;
  otherRemarks?: string;
}

export interface ProgressLog {
  id: number;
  progressPercent: number;
  remarks?: string;
  employee: string;
  loggedAt: string;
}

export interface ApiResponse {
  message: string;
}
