import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AttendanceRecord, AttendanceSummary } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(private api: ApiService) {}

  getAttendance(): Observable<AttendanceRecord[]> {
    return this.api.get<AttendanceRecord[]>('Attendance');
  }

  getTodayAttendance(): Observable<AttendanceRecord[]> {
    return this.api.get<AttendanceRecord[]>('Attendance/today');
  }

  getSummary(): Observable<AttendanceSummary> {
    return this.api.get<AttendanceSummary>('Attendance/summary');
  }

  markAttendance(data: { employeeId: number; checkIn: string; status: string }) {
    return this.api.post('Attendance', data);
  }

  // Now sends a body with checkOut datetime
  checkout(attendanceId: number, checkOutTime: string) {
    return this.api.put(`Attendance/checkout/${attendanceId}`, {
      checkOut: checkOutTime
    });
  }

  exportExcel() {
    return this.api.get<Blob>('Attendance/export');
  }
}
