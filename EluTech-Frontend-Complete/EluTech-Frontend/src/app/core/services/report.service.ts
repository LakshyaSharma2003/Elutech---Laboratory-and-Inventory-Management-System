import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Report } from '../models/report.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = environment.apiUrl;

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getReports(): Observable<Report[]> {
    return this.apiService.get<Report[]>('Report');
  }

  approveReport(id: number) {
    return this.apiService.put(`Report/approve/${id}`, {});
  }

  rejectReport(id: number, managerRemarks: string) {
    return this.apiService.put(`Report/reject/${id}`, { managerRemarks });
  }

  // Fetches the file as a blob (used to open in a new tab with proper auth header)
  fetchReportBlob(id: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/Report/view/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
  }

  uploadReport(file: File, sampleId: number, employeeId: number, reportNumber: string, remarks: string): Observable<any> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sampleId', sampleId.toString());
    formData.append('employeeId', employeeId.toString());
    formData.append('reportNumber', reportNumber);
    formData.append('remarks', remarks);
    return this.http.post(`${this.apiUrl}/Report/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
