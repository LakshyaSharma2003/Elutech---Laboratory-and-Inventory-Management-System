import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Correct field names matching AddEmployeeDto exactly
  newEmployee = {
    fullName: 'Ravi Sharma',
    email: 'ravi.sharma@elutech.com',
    password: 'Test@1234',
    phoneNumber: '9876543210',
    department: 'Chemistry',
    designation: 'Lab Analyst',
    salary: 45000,
    roleName: 'Employee'
  };

  constructor(
    private service: EmployeeService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.loading = true;
    this.service.getEmployees().subscribe({
      next: (res) => { this.employees = res; this.filteredEmployees = res; this.loading = false; },
      error: (err) => {
        this.loading = false;
        this.toast.show('Failed to load employees', 'error');
      }
    });
  }

  filterEmployees() {
    const v = this.search.toLowerCase();
    this.filteredEmployees = this.employees.filter(e =>
      e.name.toLowerCase().includes(v) ||
      e.email.toLowerCase().includes(v) ||
      e.department.toLowerCase().includes(v) ||
      e.designation.toLowerCase().includes(v)
    );
  }

  openModal() {
    this.showModal = true;
    this.newEmployee = {
      fullName: '', email: '', password: '', phoneNumber: '',
      department: '', designation: '', salary: 0, roleName: 'Employee'
    };
  }

  closeModal() { this.showModal = false; }

  saveEmployee() {
    if (!this.newEmployee.fullName || !this.newEmployee.email || !this.newEmployee.password || !this.newEmployee.roleName) {
      this.toast.show('Please fill all required fields', 'error');
      return;
    }
    this.saving = true;
    this.service.addEmployee(this.newEmployee).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Employee added successfully! 🎉', 'success');
        this.closeModal();
        this.loadEmployees();
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.message || err?.error || 'Failed to add employee';
        this.toast.show(msg, 'error');
      }
    });
  }

  fireEmployee(id: number) {
    if (!confirm('Are you sure you want to terminate this employee?')) return;
    this.service.fireEmployee(id).subscribe({
      next: () => {
        this.toast.show('Employee terminated', 'info');
        this.loadEmployees();
      },
      error: () => this.toast.show('Failed to terminate employee', 'error')
    });
  }
}
