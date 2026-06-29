export interface Report {
  id: number;
  sample: string;
  employee: string;
  version: number;
  approved: boolean;
  status: string;
  fileName: string;
}

export interface UploadReport {
  sampleId: number;
  notes: string;
}
