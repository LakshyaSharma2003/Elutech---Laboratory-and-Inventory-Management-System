import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { Report } from '../../core/models/report.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { EmployeeService } from '../../core/services/employee.service';
import { SampleService } from '../../core/services/sample.service';
import { NotificationDispatchService } from '../../core/services/notification-dispatch.service';
import { Sample } from '../../core/models/sample.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  reports: Report[] = [];
  filteredReports: Report[] = [];
  loading = true;
  search = '';
  showUploadModal = false;

  // Upload form
  uploadSampleId = 0;
  uploadRemarks = 'Final analysis report';
  selectedFile: File | null = null;
  uploading = false;

  // Employee's own ID (from API)
  myEmployeeId = 0;
  loadingEmployeeId = false;

  // Employee's assigned samples (for dropdown)
  mySamples: Sample[] = [];

  constructor(
    private service: ReportService,
    public auth: AuthService,
    private toast: ToastService,
    private employeeService: EmployeeService,
    private sampleService: SampleService,
    private notif: NotificationDispatchService
  ) {}

  ngOnInit() {
    this.loadReports();
    if (this.isEmployee) {
      this.loadMyInfo();
    }
  }

  loadReports() {
    this.loading = true;
    this.service.getReports().subscribe({
      next: (res) => { this.reports = res; this.filteredReports = res; this.loading = false; },
      error: () => { this.loading = false; this.toast.show('Failed to load reports', 'error'); }
    });
  }

  loadMyInfo() {
    this.loadingEmployeeId = true;
    this.employeeService.getMyEmployeeId().subscribe({
      next: (res) => {
        this.myEmployeeId = res.employeeId;
        this.loadingEmployeeId = false;
        // Load my assigned samples for the dropdown
        this.sampleService.getMySamples(res.employeeId).subscribe({
          next: (samples) => {
            this.mySamples = samples;
            if (samples.length > 0) this.uploadSampleId = samples[0].id;
          },
          error: () => {}
        });
      },
      error: () => {
        this.loadingEmployeeId = false;
        this.toast.show('Could not load your employee profile', 'error');
      }
    });
  }

  filterReports() {
    const v = this.search.toLowerCase();
    this.filteredReports = this.reports.filter(r =>
      r.sample?.toLowerCase().includes(v) ||
      r.employee?.toLowerCase().includes(v) ||
      r.status?.toLowerCase().includes(v)
    );
  }

  approve(id: number) {
    this.service.approveReport(id).subscribe({
      next: () => { this.toast.show('Report approved ✅', 'success'); this.loadReports(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to approve', 'error')
    });
  }

  reject(id: number) {
    this.service.rejectReport(id).subscribe({
      next: () => { this.toast.show('Report rejected', 'info'); this.loadReports(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to reject', 'error')
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  openUpload() {
    if (!this.myEmployeeId) {
      this.toast.show('Loading your profile... please wait', 'info'); return;
    }
    if (this.mySamples.length === 0) {
      this.toast.show('No samples assigned to you yet', 'error'); return;
    }
    this.uploadSampleId = this.mySamples[0].id;
    this.uploadRemarks = 'Final analysis report';
    this.selectedFile = null;
    this.showUploadModal = true;
  }

  uploadReport() {
    if (!this.selectedFile) { this.toast.show('Please select a file', 'error'); return; }
    if (!this.uploadSampleId) { this.toast.show('Please select a sample', 'error'); return; }
    if (!this.myEmployeeId) { this.toast.show('Employee ID not loaded yet', 'error'); return; }

    this.uploading = true;
    // Pass sampleId, employeeId, remarks (matching UploadReportDto exactly)
    this.service.uploadReport(this.selectedFile, this.uploadSampleId, this.myEmployeeId, this.uploadRemarks)
      .subscribe({
        next: () => {
          this.uploading = false;
          this.toast.show('Report uploaded successfully! 📄', 'success');
          this.showUploadModal = false;
          this.loadReports();
          this.notif.notifyManagers('Report Uploaded', `Employee ${this.notif.currentUserName} uploaded a report for Sample #${this.uploadSampleId}. Please review.`, 'Info');
        },
        error: (err) => {
          this.uploading = false;
          this.toast.show(err?.error?.message || 'Upload failed. Check sample ID.', 'error');
        }
      });
  }

  get isManager(): boolean { return this.auth.role() === 'Manager'; }
  get isEmployee(): boolean { return this.auth.role() === 'Employee'; }
}
