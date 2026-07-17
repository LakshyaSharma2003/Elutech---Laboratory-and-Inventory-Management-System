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

// A "thread" groups every report version uploaded for the same sample,
// so a rejection + corrected resubmission read as one continuous history
// instead of two disconnected rows.
interface ReportThread {
  sampleId: number;
  latest: Report;
  history: Report[]; // older versions, newest first, excluding `latest`
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  reports: Report[] = [];
  threads: ReportThread[] = [];
  filteredThreads: ReportThread[] = [];
  loading = true;
  search = '';
  showUploadModal = false;

  expandedSampleId: number | null = null;

  // Upload form
  uploadSampleId = 0;
  uploadReportNumber = '';
  uploadRemarks = '';
  selectedFile: File | null = null;
  uploading = false;

  // Resubmit context — set when re-uploading after a rejection
  resubmitContext: Report | null = null;

  viewingId: number | null = null;

  showRejectModal = false;
  rejectTargetId = 0;
  rejectRemarks = '';
  rejecting = false;

  myEmployeeId = 0;
  loadingEmployeeId = false;
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
    if (this.isEmployee) this.loadMyInfo();
  }

  loadReports() {
    this.loading = true;
    this.service.getReports().subscribe({
      next: (res) => { this.reports = res; this.buildThreads(); this.loading = false; },
      error: () => { this.loading = false; this.toast.show('Failed to load reports', 'error'); }
    });
  }

  // Groups all report versions per sample. The highest `version` becomes the
  // primary row; everything older is tucked into a collapsible history —
  // exactly what "rejected earlier, then corrected, now approved" looks like.
  buildThreads() {
    const bySample = new Map<number, Report[]>();
    for (const r of this.reports) {
      if (!bySample.has(r.sampleId)) bySample.set(r.sampleId, []);
      bySample.get(r.sampleId)!.push(r);
    }
    this.threads = Array.from(bySample.entries()).map(([sampleId, versions]) => {
      const sorted = [...versions].sort((a, b) => b.version - a.version);
      return { sampleId, latest: sorted[0], history: sorted.slice(1) };
    });
    this.applyFilter();
  }

  applyFilter() {
    const v = this.search.toLowerCase();
    this.filteredThreads = !v ? [...this.threads] : this.threads.filter(t =>
      t.latest.sample?.toLowerCase().includes(v) ||
      t.latest.employee?.toLowerCase().includes(v) ||
      t.latest.status?.toLowerCase().includes(v) ||
      t.latest.reportNumber?.toLowerCase().includes(v) ||
      t.history.some(h => h.reportNumber?.toLowerCase().includes(v))
    );
  }

  filterReports() { this.applyFilter(); }

  toggleHistory(sampleId: number) {
    this.expandedSampleId = this.expandedSampleId === sampleId ? null : sampleId;
  }

  loadMyInfo() {
    this.loadingEmployeeId = true;
    this.employeeService.getMyEmployeeId().subscribe({
      next: (res) => {
        this.myEmployeeId = res.employeeId;
        this.loadingEmployeeId = false;
        this.sampleService.getMySamples(res.employeeId).subscribe({
          next: (samples) => {
            this.mySamples = samples.filter(s => s.acceptanceStatus === 'Accepted');
            if (this.mySamples.length > 0) this.uploadSampleId = this.mySamples[0].id;
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

  approve(id: number) {
    const report = this.reports.find(r => r.id === id);
    this.service.approveReport(id).subscribe({
      next: () => {
        this.toast.show('Report approved ✅', 'success');
        this.loadReports();
        if (report) this.notif.notifyUser(report.employeeUserId, 'Report Approved', `Your report #${report.reportNumber} has been approved.`, 'Success');
      },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to approve', 'error')
    });
  }

  openReject(id: number) {
    this.rejectTargetId = id;
    this.rejectRemarks = '';
    this.showRejectModal = true;
  }

  confirmReject() {
    if (!this.rejectRemarks.trim()) { this.toast.show('Please add a remark explaining the rejection', 'error'); return; }
    this.rejecting = true;
    const report = this.reports.find(r => r.id === this.rejectTargetId);
    this.service.rejectReport(this.rejectTargetId, this.rejectRemarks).subscribe({
      next: () => {
        this.rejecting = false;
        this.toast.show('Report rejected with remarks', 'info');
        this.showRejectModal = false;
        this.loadReports();
        if (report) this.notif.notifyUser(report.employeeUserId, 'Report Rejected',
          `Your report #${report.reportNumber} was rejected: "${this.rejectRemarks}". Please upload a corrected version.`, 'Warning');
      },
      error: (err) => {
        this.rejecting = false;
        this.toast.show(err?.error?.message || 'Failed to reject', 'error');
      }
    });
  }

  viewReport(id: number) {
    this.viewingId = id;
    this.service.fetchReportBlob(id).subscribe({
      next: (blob) => {
        this.viewingId = null;
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: (err) => {
        this.viewingId = null;
        this.toast.show(err?.error?.message || 'Could not open report file', 'error');
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  openUpload() {
    if (!this.myEmployeeId) { this.toast.show('Loading your profile… please wait', 'info'); return; }
    if (this.mySamples.length === 0) { this.toast.show('No accepted samples available for report upload', 'error'); return; }
    this.resubmitContext = null;
    this.uploadSampleId = this.mySamples[0].id;
    this.uploadReportNumber = '';
    this.uploadRemarks = '';
    this.selectedFile = null;
    this.showUploadModal = true;
  }

  // Opens the upload modal pre-locked to the rejected sample, with the
  // rejection reason shown so the corrected upload reads as one continuous
  // thread: rejected → why → corrected upload → approved.
  openResubmit(rejectedReport: Report) {
    this.resubmitContext = rejectedReport;
    this.uploadSampleId = rejectedReport.sampleId;
    this.uploadReportNumber = '';
    this.uploadRemarks = '';
    this.selectedFile = null;
    this.showUploadModal = true;
  }

  uploadReport() {
    if (!this.selectedFile) { this.toast.show('Please select a file', 'error'); return; }
    if (!this.uploadSampleId) { this.toast.show('Please select a sample', 'error'); return; }
    if (!this.uploadReportNumber.trim()) { this.toast.show('Report number is required', 'error'); return; }

    const dup = this.reports.some(r => r.reportNumber?.toLowerCase() === this.uploadReportNumber.trim().toLowerCase());
    if (dup) { this.toast.show('This report number is already in use. Please use a unique number.', 'error'); return; }

    this.uploading = true;
    this.service.uploadReport(this.selectedFile, this.uploadSampleId, this.myEmployeeId, this.uploadReportNumber.trim(), this.uploadRemarks)
      .subscribe({
        next: () => {
          this.uploading = false;
          const wasResubmit = !!this.resubmitContext;
          this.toast.show(wasResubmit ? 'Corrected report uploaded ✅' : 'Report uploaded successfully! 📄', 'success');
          this.showUploadModal = false;
          this.resubmitContext = null;
          this.loadReports();
          this.notif.notifyManagers(
            wasResubmit ? 'Corrected Report Uploaded' : 'Report Uploaded',
            `Employee ${this.notif.currentUserName} uploaded ${wasResubmit ? 'a corrected version of' : ''} report #${this.uploadReportNumber} for review.`,
            'Info'
          );
        },
        error: (err) => {
          this.uploading = false;
          this.toast.show(err?.error?.message || 'Upload failed.', 'error');
        }
      });
  }

  get isManager(): boolean { return this.auth.role() === 'Manager'; }
  get isEmployee(): boolean { return this.auth.role() === 'Employee'; }
}
