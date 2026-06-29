import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../core/services/attendance.service';
import { AttendanceRecord, AttendanceSummary } from '../../core/models/attendance.model';
import { ToastService } from '../../core/services/toast.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit {

  records: AttendanceRecord[] = [];
  filteredRecords: AttendanceRecord[] = [];
  summary?: AttendanceSummary;
  employees: Employee[] = [];
  loading = true;
  search = '';
  showMarkModal = false;
  showCheckoutModal = false;
  saving = false;
  statuses = ['Present', 'Absent', 'Leave', 'HalfDay'];
  selectedRecord?: AttendanceRecord;

  markData = {
    employeeId: 0,
    checkInLocal: this.nowLocal(),
    status: 'Present'
  };

  checkoutData = {
    checkOutLocal: this.nowLocal()
  };

  constructor(
    private service: AttendanceService,
    private employeeService: EmployeeService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadAll();
    this.employeeService.getEmployees().subscribe({
      next: (res) => { this.employees = res.filter(e => !e.isTerminated); },
      error: () => {}
    });
  }

  nowLocal(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  loadAll() {
    this.loading = true;
    this.service.getAttendance().subscribe({
      next: (res) => { this.records = res; this.filteredRecords = res; this.loading = false; },
      error: () => { this.loading = false; this.toast.show('Failed to load attendance', 'error'); }
    });
    this.service.getSummary().subscribe({
      next: (res) => { this.summary = res; },
      error: () => {}
    });
  }

  filterRecords() {
    const v = this.search.toLowerCase();
    this.filteredRecords = this.records.filter(r =>
      r.employeeName?.toLowerCase().includes(v) ||
      r.status?.toLowerCase().includes(v)
    );
  }

  openMarkModal() {
    this.markData = {
      employeeId: this.employees[0]?.id || 0,
      checkInLocal: this.nowLocal(),
      status: 'Present'
    };
    this.showMarkModal = true;
  }

  markAttendance() {
    if (!this.markData.employeeId) { this.toast.show('Please select an employee', 'error'); return; }
    if (!this.markData.checkInLocal) { this.toast.show('Check-in time is required', 'error'); return; }
    this.saving = true;
    const payload = {
      employeeId: this.markData.employeeId,
      checkIn: new Date(this.markData.checkInLocal).toISOString(),
      status: this.markData.status
    };
    this.service.markAttendance(payload).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Attendance marked ✅', 'success');
        this.showMarkModal = false;
        this.loadAll();
      },
      error: (err) => {
        this.saving = false;
        this.toast.show(err?.error?.message || 'Failed to mark attendance', 'error');
      }
    });
  }

  openCheckoutModal(record: AttendanceRecord) {
    this.selectedRecord = record;
    this.checkoutData = { checkOutLocal: this.nowLocal() };
    this.showCheckoutModal = true;
  }

  doCheckout() {
    if (!this.selectedRecord) return;
    if (!this.checkoutData.checkOutLocal) { this.toast.show('Please select checkout time', 'error'); return; }
    this.saving = true;
    const isoTime = new Date(this.checkoutData.checkOutLocal).toISOString();
    this.service.checkout(this.selectedRecord.id, isoTime).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Check-out recorded ✅', 'success');
        this.showCheckoutModal = false;
        this.loadAll();
      },
      error: (err) => {
        this.saving = false;
        this.toast.show(err?.error?.message || 'Failed to check out', 'error');
      }
    });
  }

  exportExcel() {
    const token = localStorage.getItem('token');
    // Open in new tab to trigger download
    window.open(`${window.location.origin}/api/Attendance/export`, '_blank');
    this.toast.show('Export started', 'info');
  }

  formatTime(date: string | null | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  getEmployeeName(id: number): string {
    return this.employees.find(e => e.id === id)?.name || `Employee #${id}`;
  }
}
