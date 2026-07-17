import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AttendanceRecord, AttendanceSummary, EmployeeCheckLog } from '../models/attendance.model';

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

  // Employee self-reported check-in/out — reference only, does NOT mark official attendance
  selfCheckIn(employeeId: number): Observable<EmployeeCheckLog> {
    return this.api.post<EmployeeCheckLog>('Attendance/self-checkin', { employeeId });
  }

  selfCheckOut(employeeId: number): Observable<EmployeeCheckLog> {
    return this.api.post<EmployeeCheckLog>('Attendance/self-checkout', { employeeId });
  }

  getTodaySelfLogs(): Observable<EmployeeCheckLog[]> {
    return this.api.get<EmployeeCheckLog[]>('Attendance/self-logs/today');
  }

  // Restores the employee's own today status after page reload/re-login
  getMyTodayStatus(employeeId: number): Observable<EmployeeCheckLog | null> {
    return this.api.get<EmployeeCheckLog | null>(`Attendance/self-status/${employeeId}`);
  }
}
