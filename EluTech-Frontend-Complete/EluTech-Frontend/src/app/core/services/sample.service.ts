import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Sample, AddSample } from '../models/sample.model';

@Injectable({ providedIn: 'root' })
export class SampleService {
  constructor(private api: ApiService) {}

  getSamples(): Observable<Sample[]> {
    return this.api.get<Sample[]>('Sample/samples');
  }

  // New endpoint for employees to see their own samples
  getMySamples(employeeId: number): Observable<Sample[]> {
    return this.api.get<Sample[]>(`Sample/my-samples/${employeeId}`);
  }

  addSample(data: AddSample) {
    return this.api.post('Sample/add-sample', data);
  }

  approve(requestId: number) {
    return this.api.put(`Sample/approve/${requestId}`, {});
  }

  reject(requestId: number) {
    return this.api.put(`Sample/reject/${requestId}`, {});
  }
}
