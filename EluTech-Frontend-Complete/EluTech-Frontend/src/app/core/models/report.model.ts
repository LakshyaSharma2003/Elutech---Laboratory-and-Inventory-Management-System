export interface Report {
  id: number;
  sampleId: number;
  employeeUserId: number;
  reportNumber: string;
  sample: string;
  employee: string;
  version: number;
  approved: boolean;
  status: string;
  fileName: string;
  remarks?: string;
  managerRemarks?: string;
}
