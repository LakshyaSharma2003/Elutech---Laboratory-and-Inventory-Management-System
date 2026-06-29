import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SampleService } from '../../core/services/sample.service';
import { Sample, AddSample } from '../../core/models/sample.model';
import { ToastService } from '../../core/services/toast.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { AuthService } from '../../core/services/auth.service';
import { CustomerService, CustomerItem } from '../../core/services/customer.service';

@Component({
  selector: 'app-samples',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './samples.html',
  styleUrl: './samples.css'
})
export class Samples implements OnInit {

  samples: Sample[] = [];
  filteredSamples: Sample[] = [];
  employees: Employee[] = [];
  customers: CustomerItem[] = [];
  loading = true;
  loadingDropdowns = false;
  search = '';
  showModal = false;
  saving = false;

  newSample: AddSample = {
    sampleName: '',
    customerId: 0,
    assignedEmployeeId: 0
  };

  constructor(
    private sampleService: SampleService,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadSamples();
    if (this.isManager) {
      this.loadDropdownData();
    }
  }

  loadSamples() {
    this.loading = true;
    if (this.isManager) {
      // Manager sees ALL samples
      this.sampleService.getSamples().subscribe({
        next: (res) => { this.samples = res; this.filteredSamples = res; this.loading = false; },
        error: () => { this.loading = false; this.toast.show('Failed to load samples', 'error'); }
      });
    } else {
      // Employee only sees their own assigned samples
      this.employeeService.getMyEmployeeId().subscribe({
        next: (res) => {
          this.sampleService.getMySamples(res.employeeId).subscribe({
            next: (data) => { this.samples = data; this.filteredSamples = data; this.loading = false; },
            error: () => { this.loading = false; this.toast.show('Failed to load samples', 'error'); }
          });
        },
        error: () => { this.loading = false; this.toast.show('Could not load employee profile', 'error'); }
      });
    }
  }

  loadDropdownData() {
    this.loadingDropdowns = true;
    // Load employees
    this.employeeService.getEmployees().subscribe({
      next: (res) => { this.employees = res.filter(e => !e.isTerminated); },
      error: () => {}
    });
    // Load customers from real API
    this.customerService.getCustomers().subscribe({
      next: (res) => { this.customers = res; this.loadingDropdowns = false; },
      error: () => { this.loadingDropdowns = false; }
    });
  }

  filterSamples() {
    const v = this.search.toLowerCase();
    this.filteredSamples = this.samples.filter(x =>
      x.sampleCode?.toLowerCase().includes(v) ||
      x.sampleName?.toLowerCase().includes(v) ||
      x.employee?.toLowerCase().includes(v) ||
      x.status?.toLowerCase().includes(v)
    );
  }

  openModal() {
    if (this.customers.length === 0) {
      this.toast.show('No customers found. Go to Customers page and add one first.', 'error');
      return;
    }
    if (this.employees.length === 0) {
      this.toast.show('No active employees found. Add employees first.', 'error');
      return;
    }
    this.newSample = {
      sampleName: '',
      customerId: this.customers[0].id,
      assignedEmployeeId: this.employees[0].id
    };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  saveSample() {
    if (!this.newSample.sampleName?.trim()) { this.toast.show('Sample name is required', 'error'); return; }
    if (!this.newSample.customerId) { this.toast.show('Please select a customer', 'error'); return; }
    if (!this.newSample.assignedEmployeeId) { this.toast.show('Please select an employee', 'error'); return; }
    this.saving = true;
    this.sampleService.addSample(this.newSample).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Sample added successfully! 🧪', 'success');
        this.closeModal();
        this.loadSamples();
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.message || err?.error || 'Failed to add sample. Ensure customer and employee IDs exist.';
        this.toast.show(msg, 'error');
      }
    });
  }

  approve(id: number) {
    this.sampleService.approve(id).subscribe({
      next: () => { this.toast.show('Request approved ✅', 'success'); this.loadSamples(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to approve', 'error')
    });
  }

  reject(id: number) {
    this.sampleService.reject(id).subscribe({
      next: () => { this.toast.show('Request rejected', 'info'); this.loadSamples(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to reject', 'error')
    });
  }

  get isManager(): boolean { return this.auth.role() === 'Manager'; }
}
