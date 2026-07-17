import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { exportToCSV } from '../../core/utils/export.utils';
import { sortData, SortState } from '../../core/utils/sort.utils';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {

  search = '';
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  loading = true;
  showModal = false;
  saving = false;

  // Confirm dialog state
  showConfirm = false;
  confirmTargetId = 0;
  confirmName = '';

  // Sort state
  sort: SortState = { column: '', direction: 'none' };
  readonly sortIcons: Record<string, string> = { none: '⇅', asc: '↑', desc: '↓' };

  newEmployee = {
    fullName: '', email: '', password: '', phoneNumber: '',
    department: '', designation: '', salary: 0, roleName: 'Employee'
  };

  constructor(private service: EmployeeService, private toast: ToastService) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.loading = true;
    this.service.getEmployees().subscribe({
      next: (res) => { this.employees = res; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; this.toast.show('Failed to load employees', 'error'); }
    });
  }

  applyFilter() {
    const v = this.search.toLowerCase();
    let result = v
      ? this.employees.filter(e =>
          e.name?.toLowerCase().includes(v) ||
          e.email?.toLowerCase().includes(v) ||
          e.department?.toLowerCase().includes(v) ||
          e.designation?.toLowerCase().includes(v))
      : [...this.employees];
    this.filteredEmployees = sortData(result, this.sort);
  }

  filterEmployees() { this.applyFilter(); }

  setSort(col: string) {
    if (this.sort.column === col) {
      this.sort = { column: col, direction: this.sort.direction === 'asc' ? 'desc' : this.sort.direction === 'desc' ? 'none' : 'asc' };
    } else {
      this.sort = { column: col, direction: 'asc' };
    }
    this.applyFilter();
  }

  sortIcon(col: string): string {
    return this.sort.column === col ? this.sortIcons[this.sort.direction] : this.sortIcons['none'];
  }

  exportCSV() {
    const rows = this.filteredEmployees.map(e => ({
      ID: e.id, Name: e.name, Email: e.email, Department: e.department,
      Designation: e.designation, Salary: e.salary, Status: e.isTerminated ? 'Terminated' : 'Active'
    }));
    exportToCSV(rows, 'employees');
    this.toast.show('Employees exported as CSV ✅', 'success');
  }

  openModal() {
    this.showModal = true;
    this.newEmployee = { fullName: '', email: '', password: '', phoneNumber: '', department: '', designation: '', salary: 0, roleName: 'Employee' };
  }

  saveEmployee() {
    if (!this.newEmployee.fullName?.trim() || !this.newEmployee.email?.trim()) { this.toast.show('Name and email are required', 'error'); return; }
    this.saving = true;
    this.service.addEmployee(this.newEmployee).subscribe({
      next: () => { this.saving = false; this.toast.show('Employee added ✅', 'success'); this.showModal = false; this.loadEmployees(); },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add employee', 'error'); }
    });
  }

  // Show confirm before firing
  askFire(emp: Employee) {
    this.confirmTargetId = emp.id;
    this.confirmName = emp.name;
    this.showConfirm = true;
  }

  fireEmployee() {
    this.showConfirm = false;
    this.service.fireEmployee(this.confirmTargetId).subscribe({
      next: () => { this.toast.show(`${this.confirmName} terminated`, 'info'); this.loadEmployees(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to terminate', 'error')
    });
  }
}
