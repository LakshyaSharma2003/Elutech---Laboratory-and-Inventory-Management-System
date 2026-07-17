import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Sample, AddSample, UpdateSampleDetails, ProgressLog } from '../models/sample.model';

@Injectable({ providedIn: 'root' })
export class SampleService {
  constructor(private api: ApiService) {}

  getSamples(): Observable<Sample[]> {
    return this.api.get<Sample[]>('Sample/samples');
  }

  getSamplesByType(type: 'Government' | 'Private'): Observable<Sample[]> {
    return this.api.get<Sample[]>(`Sample/samples/${type}`);
  }

  getMySamples(employeeId: number): Observable<Sample[]> {
    return this.api.get<Sample[]>(`Sample/my-samples/${employeeId}`);
  }

  addSample(data: AddSample) {
    return this.api.post('Sample/add-sample', data);
  }

  approve(requestId: number) {
    return this.api.put(`Sample/approve-request/${requestId}`, {});
  }

  reject(requestId: number) {
    return this.api.put(`Sample/reject-request/${requestId}`, {});
  }

  updateDetails(sampleId: number, data: UpdateSampleDetails) {
    return this.api.put(`Sample/${sampleId}/update-details`, data);
  }

  acceptSample(sampleId: number, expectedCompletionDate: string) {
    return this.api.put(`Sample/${sampleId}/accept`, { expectedCompletionDate });
  }

  rejectSample(sampleId: number, remarks: string) {
    return this.api.put(`Sample/${sampleId}/reject`, { remarks });
  }

  addProgress(sampleId: number, employeeId: number, progressPercent: number, remarks: string) {
    return this.api.post('Sample/progress', { sampleId, employeeId, progressPercent, remarks });
  }

  getProgressLogs(sampleId: number): Observable<ProgressLog[]> {
    return this.api.get<ProgressLog[]>(`Sample/progress/${sampleId}`);
  }
}
