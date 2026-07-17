import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SampleService } from '../../core/services/sample.service';
import { Sample, AddSample, UpdateSampleDetails, ProgressLog } from '../../core/models/sample.model';
import { ToastService } from '../../core/services/toast.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { AuthService } from '../../core/services/auth.service';
import { CustomerService, CustomerItem } from '../../core/services/customer.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NotificationDispatchService } from '../../core/services/notification-dispatch.service';
import { exportToCSV } from '../../core/utils/export.utils';
import { sortData, SortState } from '../../core/utils/sort.utils';

@Component({
  selector: 'app-samples',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './samples.html',
  styleUrl: './samples.css'
})
export class Samples implements OnInit {

  // Manager: Government / Private tabs. Employee: sees only their own, no tabs.
  activeSampleTab: 'Government' | 'Private' = 'Private';

  samples: Sample[] = [];
  filteredSamples: Sample[] = [];
  employees: Employee[] = [];
  customers: CustomerItem[] = [];
  loading = true;
  loadingDropdowns = false;
  search = '';
  showModal = false;
  saving = false;

  sort: SortState = { column: '', direction: 'none' };
  readonly sortIcons: Record<string, string> = { none: '⇅', asc: '↑', desc: '↓' };

  showConfirmReject = false;
  confirmRejectId = 0;

  newSample: AddSample = { sampleName: '', sampleType: 'Private', customerId: 0, assignedEmployeeId: 0 };

  readonly phases = ['Pre-treatment', 'Analysis', 'Post-processing', 'Reporting', 'Completed'];

  // ── Edit / fill-in-later details modal ──
  showDetailsModal = false;
  detailsTarget: Sample | null = null;
  detailsForm: UpdateSampleDetails = {};
  savingDetails = false;

  // ── Employee accept/reject modal ──
  showAcceptModal = false;
  showEmployeeRejectModal = false;
  workflowTarget: Sample | null = null;
  acceptExpectedDate = '';
  employeeRejectRemarks = '';
  workflowSaving = false;
  myEmployeeId = 0;

  // ── Progress update modal ──
  showProgressModal = false;
  progressTarget: Sample | null = null;
  progressValue = 0;
  progressRemarks = '';
  progressSaving = false;

  // ── Progress history panel ──
  expandedProgressSampleId: number | null = null;
  progressHistory: ProgressLog[] = [];
  loadingHistory = false;

  constructor(
    private sampleService: SampleService,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private toast: ToastService,
    private notif: NotificationDispatchService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadSamples();
    if (this.isManager) this.loadDropdownData();
    if (this.isEmployee) {
      this.employeeService.getMyEmployeeId().subscribe({
        next: (res) => { this.myEmployeeId = res.employeeId; },
        error: () => {}
      });
    }
  }

  loadSamples() {
    this.loading = true;
    if (this.isManager) {
      this.sampleService.getSamplesByType(this.activeSampleTab).subscribe({
        next: (res) => { this.samples = res; this.applyFilter(); this.loading = false; },
        error: () => { this.loading = false; this.toast.show('Failed to load samples', 'error'); }
      });
    } else {
      this.employeeService.getMyEmployeeId().subscribe({
        next: (res) => {
          this.myEmployeeId = res.employeeId;
          this.sampleService.getMySamples(res.employeeId).subscribe({
            next: (data) => { this.samples = data; this.applyFilter(); this.loading = false; },
            error: () => { this.loading = false; }
          });
        },
        error: () => { this.loading = false; }
      });
    }
  }

  switchTab(tab: 'Government' | 'Private') {
    this.activeSampleTab = tab;
    this.loadSamples();
  }

  loadDropdownData() {
    this.loadingDropdowns = true;
    this.employeeService.getEmployees().subscribe({ next: (res) => { this.employees = res.filter(e => !e.isTerminated); }, error: () => {} });
    this.customerService.getCustomers().subscribe({ next: (res) => { this.customers = res; this.loadingDropdowns = false; }, error: () => { this.loadingDropdowns = false; } });
  }

  applyFilter() {
    const v = this.search.toLowerCase();
    let result = v
      ? this.samples.filter(s => s.sampleCode?.toLowerCase().includes(v) || s.sampleName?.toLowerCase().includes(v) || s.employee?.toLowerCase().includes(v) || s.status?.toLowerCase().includes(v) || s.currentPhase?.toLowerCase().includes(v) || s.customerOrBranchName?.toLowerCase().includes(v))
      : [...this.samples];
    this.filteredSamples = sortData(result, this.sort);
  }

  filterSamples() { this.applyFilter(); }

  setSort(col: string) {
    this.sort = this.sort.column === col
      ? { column: col, direction: this.sort.direction === 'asc' ? 'desc' : this.sort.direction === 'desc' ? 'none' : 'asc' }
      : { column: col, direction: 'asc' };
    this.applyFilter();
  }
  sortIcon(col: string) { return this.sort.column === col ? this.sortIcons[this.sort.direction] : this.sortIcons['none']; }

  exportCSV() {
    const rows = this.filteredSamples.map(s => ({
      Code: s.sampleCode, Type: s.sampleType, Sample: s.sampleName,
      CustomerOrBranch: s.customerOrBranchName, Employee: s.employee,
      Phase: s.currentPhase, Status: s.status, Acceptance: s.acceptanceStatus, Progress: s.progressPercent + '%'
    }));
    exportToCSV(rows, `samples_${this.activeSampleTab}`);
    this.toast.show('Samples exported ✅', 'success');
  }

  phaseIndex(phase: string): number { return this.phases.indexOf(phase); }

  // ── Add Sample ──
  openModal() {
    if (this.newSample.sampleType === 'Private' && !this.customers.length) { this.toast.show('Add customers first before creating a private sample', 'error'); return; }
    if (!this.employees.length) { this.toast.show('Add employees first', 'error'); return; }
    this.newSample = {
      sampleName: '', sampleType: this.activeSampleTab,
      customerId: this.customers[0]?.id, branchName: '', branchAddress: '',
      assignedEmployeeId: this.employees[0].id,
      dateArrived: '', isNumber: '', typeOfTest: '', sampleSize: '', conditionOnReceiving: '', otherRemarks: ''
    };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  saveSample() {
    if (!this.newSample.sampleName?.trim()) { this.toast.show('Sample name is required', 'error'); return; }
    if (this.newSample.sampleType === 'Private' && !this.newSample.customerId) { this.toast.show('Select a customer', 'error'); return; }
    if (this.newSample.sampleType === 'Government' && !this.newSample.branchName?.trim()) { this.toast.show('Branch name is required for Government samples', 'error'); return; }
    if (!this.newSample.assignedEmployeeId) { this.toast.show('Select an employee', 'error'); return; }
    this.saving = true;
    this.sampleService.addSample(this.newSample).subscribe({
      next: () => {
        this.saving = false; this.toast.show('Sample added ✅', 'success'); this.closeModal();
        this.activeSampleTab = this.newSample.sampleType;
        const assignedEmp = this.employees.find(e => e.id === this.newSample.assignedEmployeeId);
        if (assignedEmp) {
          this.notif.notifyUser(assignedEmp.userId, 'New Sample Assigned',
            `You've been assigned sample "${this.newSample.sampleName}". Please accept or reject it.`, 'Info');
        }
        this.loadSamples();
      },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add sample', 'error'); }
    });
  }

  approve(id: number) {
    this.sampleService.approve(id).subscribe({
      next: () => { this.toast.show('Request approved ✅', 'success'); this.loadSamples(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed', 'error')
    });
  }

  askReject(id: number) { this.confirmRejectId = id; this.showConfirmReject = true; }

  doReject() {
    this.showConfirmReject = false;
    this.sampleService.reject(this.confirmRejectId).subscribe({
      next: () => { this.toast.show('Request rejected', 'info'); this.loadSamples(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed', 'error')
    });
  }

  // ── Fill-in-later details ──
  openDetails(sample: Sample) {
    this.detailsTarget = sample;
    this.detailsForm = {
      dateArrived: sample.dateArrived?.substring(0, 10) || '',
      isNumber: sample.isNumber || '',
      typeOfTest: sample.typeOfTest || '',
      sampleSize: sample.sampleSize || '',
      generatedCode: sample.generatedCode || '',
      processStartDate: sample.processStartDate?.substring(0, 10) || '',
      completionDate: sample.completionDate?.substring(0, 10) || '',
      conditionOnReceiving: sample.conditionOnReceiving || '',
      otherRemarks: sample.otherRemarks || ''
    };
    this.showDetailsModal = true;
  }

  saveDetails() {
    if (!this.detailsTarget) return;
    this.savingDetails = true;
    this.sampleService.updateDetails(this.detailsTarget.id, this.detailsForm).subscribe({
      next: () => { this.savingDetails = false; this.toast.show('Sample details updated ✅', 'success'); this.showDetailsModal = false; this.loadSamples(); },
      error: (err) => { this.savingDetails = false; this.toast.show(err?.error?.message || 'Failed to update', 'error'); }
    });
  }

  // ── Employee: Accept / Reject assigned sample ──
  openAccept(sample: Sample) {
    this.workflowTarget = sample;
    this.acceptExpectedDate = '';
    this.showAcceptModal = true;
  }

  confirmAccept() {
    if (!this.workflowTarget) return;
    if (!this.acceptExpectedDate) { this.toast.show('Please set an expected completion date', 'error'); return; }
    this.workflowSaving = true;
    this.sampleService.acceptSample(this.workflowTarget.id, this.acceptExpectedDate).subscribe({
      next: () => {
        this.workflowSaving = false; this.toast.show('Sample accepted ✅', 'success'); this.showAcceptModal = false; this.loadSamples();
        this.notif.notifyManagers('Sample Accepted', `${this.notif.currentUserName} accepted sample ${this.workflowTarget?.sampleCode}`, 'Success');
      },
      error: (err) => { this.workflowSaving = false; this.toast.show(err?.error?.message || 'Failed to accept', 'error'); }
    });
  }

  openEmployeeReject(sample: Sample) {
    this.workflowTarget = sample;
    this.employeeRejectRemarks = '';
    this.showEmployeeRejectModal = true;
  }

  confirmEmployeeReject() {
    if (!this.workflowTarget) return;
    if (!this.employeeRejectRemarks.trim()) { this.toast.show('Please explain why you are rejecting this sample', 'error'); return; }
    this.workflowSaving = true;
    this.sampleService.rejectSample(this.workflowTarget.id, this.employeeRejectRemarks).subscribe({
      next: () => {
        this.workflowSaving = false; this.toast.show('Sample rejected with remarks', 'info'); this.showEmployeeRejectModal = false; this.loadSamples();
        this.notif.notifyManagers('Sample Rejected by Employee', `${this.notif.currentUserName} rejected sample ${this.workflowTarget?.sampleCode}: "${this.employeeRejectRemarks}"`, 'Warning');
      },
      error: (err) => { this.workflowSaving = false; this.toast.show(err?.error?.message || 'Failed to reject', 'error'); }
    });
  }

  // ── Progress update ──
  openProgress(sample: Sample) {
    this.progressTarget = sample;
    this.progressValue = sample.progressPercent || 0;
    this.progressRemarks = '';
    this.showProgressModal = true;
  }

  saveProgress() {
    if (!this.progressTarget) return;
    this.progressSaving = true;
    this.sampleService.addProgress(this.progressTarget.id, this.myEmployeeId, this.progressValue, this.progressRemarks).subscribe({
      next: () => {
        this.progressSaving = false; this.toast.show('Progress updated ✅', 'success'); this.showProgressModal = false; this.loadSamples();
        this.notif.notifyManagers('Sample Progress Updated', `${this.notif.currentUserName} updated sample ${this.progressTarget?.sampleCode} to ${this.progressValue}%`, 'Info');
      },
      error: (err) => { this.progressSaving = false; this.toast.show(err?.error?.message || 'Failed to update progress', 'error'); }
    });
  }

  toggleHistory(sample: Sample) {
    if (this.expandedProgressSampleId === sample.id) { this.expandedProgressSampleId = null; return; }
    this.expandedProgressSampleId = sample.id;
    this.loadingHistory = true;
    this.sampleService.getProgressLogs(sample.id).subscribe({
      next: (res) => { this.progressHistory = res; this.loadingHistory = false; },
      error: () => { this.loadingHistory = false; }
    });
  }

  get isManager(): boolean { return this.auth.role() === 'Manager'; }
  get isEmployee(): boolean { return this.auth.role() === 'Employee'; }
}
