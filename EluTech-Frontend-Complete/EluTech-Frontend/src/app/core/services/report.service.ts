import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  rejectReport(id: number) {
    return this.apiService.put(`Report/reject/${id}`, {});
  }

  // UploadReportDto: SampleId, EmployeeId, Remarks (NOT notes!)
  uploadReport(file: File, sampleId: number, employeeId: number, remarks: string): Observable<any> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sampleId', sampleId.toString());
    formData.append('employeeId', employeeId.toString());
    formData.append('remarks', remarks);
    return this.http.post(`${this.apiUrl}/Report/upload`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
