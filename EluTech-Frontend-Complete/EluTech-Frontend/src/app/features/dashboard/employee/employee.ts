import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NgApexchartsModule, ApexChart, ApexAxisChartSeries,
  ApexXAxis, ApexFill, ApexStroke, ApexGrid,
  ApexNonAxisChartSeries, ApexLegend, ApexPlotOptions
} from 'ng-apexcharts';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { SampleService } from '../../../core/services/sample.service';
import { AttendanceService } from '../../../core/services/attendance.service';
import { ToastService } from '../../../core/services/toast.service';
import { Sample } from '../../../core/models/sample.model';
import { EmployeeDashboard } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})
export class Employee implements OnInit {

  today = new Date();
  loading = true;
  dashboard: EmployeeDashboard = { assignedSamples: 0, pendingRequests: 0, reportsUploaded: 0 };
  assignedSamples: Sample[] = [];

  get cards() {
    return [
      { label: 'Assigned Samples', value: this.dashboard.assignedSamples, icon: '🧪', cls: 'purple' },
      { label: 'Pending Requests', value: this.dashboard.pendingRequests, icon: '⏳', cls: 'amber'  },
      { label: 'Reports Uploaded', value: this.dashboard.reportsUploaded, icon: '📄', cls: 'blue'   },
      { label: 'Today Attendance', value: 'Present',                      icon: '✅', cls: 'green'  },
    ];
  }

  // Weekly activity chart
  activitySeries: ApexAxisChartSeries = [
    { name: 'Samples Worked', data: [2, 3, 1, 4, 2, 3, 0] },
    { name: 'Reports Submitted', data: [1, 1, 0, 2, 1, 2, 0] }
  ];
  activityChart: ApexChart = { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: 'inherit' };
  activityXAxis: ApexXAxis = { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { style: { colors: '#94A3B8', fontSize: '12px' } }, axisBorder: { show: false }, axisTicks: { show: false } };
  activityPlot: ApexPlotOptions = { bar: { borderRadius: 4, columnWidth: '55%' } };
  activityColors = ['#8B5CF6', '#3B82F6'];
  activityGrid: ApexGrid = { borderColor: '#F1F5F9', strokeDashArray: 4 };

  // Sample status donut — updated from real data
  sampleStatusSeries: ApexNonAxisChartSeries = [0, 0, 0];
  sampleStatusChart: ApexChart = { type: 'donut', height: 200, fontFamily: 'inherit' };
  sampleStatusLabels = ['Active', 'Pending', 'Completed'];
  sampleStatusColors = ['#10B981', '#F59E0B', '#3B82F6'];
  sampleStatusLegend: ApexLegend = { position: 'bottom', fontSize: '12px', fontFamily: 'inherit', labels: { colors: '#64748B' } };

  recentActivity = [
    { action: 'Attendance marked for today', time: 'Today, 9:00 AM', icon: '✅' },
    { action: 'Log in to see your latest sample activity', time: 'Just now', icon: 'ℹ️' },
  ];

  // Self check-in/out — reference only for Manager, does not mark official attendance
  myEmpId = 0;
  selfCheckedIn = false;
  selfCheckedOut = false;
  selfCheckInTime: string | null = null;
  selfCheckOutTime: string | null = null;
  checkingIn = false;
  checkingOut = false;

  constructor(
    private dashboardService: DashboardService,
    private employeeService: EmployeeService,
    private sampleService: SampleService,
    private attendanceService: AttendanceService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading = true;
    // Get real employeeId via API (JWT only has userId, not employeeId)
    this.employeeService.getMyEmployeeId().subscribe({
      next: (res) => {
        const empId = res.employeeId;
        this.myEmpId = empId;
        this.loadSelfCheckStatus(empId);
        this.dashboardService.getEmployeeDashboard(empId).subscribe({
          next: (r) => { this.dashboard = r; this.loading = false; },
          error: () => { this.loading = false; }
        });
        this.sampleService.getMySamples(empId).subscribe({
          next: (samples) => {
            this.assignedSamples = samples;
            const active    = samples.filter(s => s.status === 'Active').length;
            const pending   = samples.filter(s => s.status === 'Pending').length;
            const completed = samples.filter(s => s.status === 'Completed').length;
            this.sampleStatusSeries = [active, pending, completed];
            this.dashboard.assignedSamples = samples.length;
          },
          error: () => {}
        });
      },
      error: () => { this.loading = false; }
    });
  }

  get employeeName(): string {
    const user = this.auth.user();
    return user?.name || user?.unique_name || user?.given_name || 'Employee';
  }

  get employeeId(): number {
    const user = this.auth.user();
    return Number(user?.nameid || user?.sub || 0);
  }

  get dayOfWeek(): string { return this.today.toLocaleDateString('en-IN', { weekday: 'long' }); }
  get formattedDate(): string { return this.today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
  get greeting(): string {
    const h = this.today.getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  }

  loadSelfCheckStatus(employeeId: number) {
    this.attendanceService.getMyTodayStatus(employeeId).subscribe({
      next: (log) => {
        if (log) {
          this.selfCheckedIn = !!log.selfCheckIn;
          this.selfCheckInTime = log.selfCheckIn || null;
          this.selfCheckedOut = !!log.selfCheckOut;
          this.selfCheckOutTime = log.selfCheckOut || null;
        } else {
          this.selfCheckedIn = false;
          this.selfCheckedOut = false;
          this.selfCheckInTime = null;
          this.selfCheckOutTime = null;
        }
      },
      error: () => {}
    });
  }

  doSelfCheckIn() {
    if (!this.myEmpId) { this.toast.show('Loading your profile… try again in a moment', 'info'); return; }
    this.checkingIn = true;
    this.attendanceService.selfCheckIn(this.myEmpId).subscribe({
      next: (log) => {
        this.checkingIn = false;
        this.selfCheckedIn = true;
        this.selfCheckInTime = log.selfCheckIn || new Date().toISOString();
        this.toast.show('Checked in! Your Manager can now see you\'ve arrived.', 'success');
      },
      error: (err) => { this.checkingIn = false; this.toast.show(err?.error?.message || 'Failed to check in', 'error'); }
    });
  }

  doSelfCheckOut() {
    if (!this.myEmpId) return;
    this.checkingOut = true;
    this.attendanceService.selfCheckOut(this.myEmpId).subscribe({
      next: (log) => {
        this.checkingOut = false;
        this.selfCheckedOut = true;
        this.selfCheckOutTime = log.selfCheckOut || new Date().toISOString();
        this.toast.show('Checked out! Have a good day.', 'success');
      },
      error: (err) => { this.checkingOut = false; this.toast.show(err?.error?.message || 'Failed to check out. Check in first.', 'error'); }
    });
  }

  formatTime(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}
