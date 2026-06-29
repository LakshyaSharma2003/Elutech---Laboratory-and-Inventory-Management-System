import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { Invoice, Payment, Expense, Salary, Tax, GenerateInvoice } from '../../core/models/finance.model';
import { ToastService } from '../../core/services/toast.service';
import { CustomerService, CustomerItem } from '../../core/services/customer.service';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../core/models/employee.model';
import { ApiService } from '../../core/services/api.service';
import { NotificationDispatchService } from '../../core/services/notification-dispatch.service';

@Component({
  selector: 'app-finance-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance.html',
  styleUrl: './finance.css'
})
export class Finance implements OnInit {

  loading = true;
  loadingDropdowns = true;
  search = '';
  saving = false;

  customers: CustomerItem[] = [];
  employees: Employee[] = [];

  cards = [
    { title: 'Revenue', value: 0 },
    { title: 'Expenses', value: 0 },
    { title: 'Taxes', value: 0 },
    { title: 'Profit', value: 0 }
  ];
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];

  showPayment = false; showExpense = false;
  showSalary = false;  showTax = false; showInvoice = false;

  payment: Payment = { customerId: 0, amount: 0, paymentMethod: '', referenceNumber: '' };
  expense: Expense = { title: '', amount: 0, category: '', description: '' };
  salary: Salary = { employeeId: 0, amount: 0, month: '' };
  tax: Tax = { taxName: '', amount: 0 };
  invoice: GenerateInvoice = { customerId: 0, amount: 0, gstPercentage: 18, notes: '' };

  constructor(
    private financeService: FinanceService,
    private customerService: CustomerService,
    private api: ApiService,
    private employeeService: EmployeeService,
    private toast: ToastService,
    private notif: NotificationDispatchService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadDropdowns();
  }

  loadDropdowns() {
    this.loadingDropdowns = true;
    let customersLoaded = false;
    let employeesLoaded = false;
    const checkDone = () => { if (customersLoaded && employeesLoaded) this.loadingDropdowns = false; };

    this.customerService.getCustomers().subscribe({
      next: (res) => {
        this.customers = res;
        if (res.length > 0) { this.payment.customerId = res[0].id; this.invoice.customerId = res[0].id; }
        customersLoaded = true; checkDone();
      },
      error: () => { customersLoaded = true; checkDone(); }
    });

    // Use Finance/employees endpoint which FinanceOfficer can access
    this.api.get<any[]>('Finance/employees').subscribe({
      next: (res) => {
        this.employees = res.filter((e: any) => !e.isTerminated);
        if (this.employees.length > 0) this.salary.employeeId = this.employees[0].id;
        employeesLoaded = true; checkDone();
      },
      error: () => { employeesLoaded = true; checkDone(); }
    });
  }

  loadData() {
    this.loading = true;
    this.financeService.getProfitLoss().subscribe({
      next: (res) => {
        this.cards = [
          { title: 'Revenue', value: res.revenue },
          { title: 'Expenses', value: res.expenses },
          { title: 'Taxes', value: res.taxes },
          { title: 'Profit', value: res.profit }
        ];
      }, error: () => {}
    });
    this.financeService.getInvoices().subscribe({
      next: (res) => { this.invoices = res; this.filteredInvoices = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filterInvoices() {
    const v = this.search.toLowerCase();
    this.filteredInvoices = this.invoices.filter(x =>
      x.invoiceNumber.toLowerCase().includes(v) || x.customer.toLowerCase().includes(v)
    );
  }

  downloadInvoice(id: number) {
    this.financeService.downloadInvoice(id).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `Invoice_${id}.pdf`; a.click();
        URL.revokeObjectURL(url);
        this.toast.show('Invoice downloaded', 'success');
      },
      error: () => this.toast.show('Failed to download invoice', 'error')
    });
  }

  openPayment() { this.payment = { customerId: this.customers[0]?.id || 0, amount: 0, paymentMethod: '', referenceNumber: '' }; this.showPayment = true; }
  openExpense() { this.expense = { title: '', amount: 0, category: '', description: '' }; this.showExpense = true; }
  openSalary()  { this.salary  = { employeeId: this.employees[0]?.id || 0, amount: 0, month: '' }; this.showSalary = true; }
  openTax()     { this.tax     = { taxName: '', amount: 0 }; this.showTax = true; }
  openInvoice() { this.invoice = { customerId: this.customers[0]?.id || 0, amount: 0, gstPercentage: 18, notes: '' }; this.showInvoice = true; }

  savePayment() {
    if (!this.payment.customerId) { this.toast.show('Please select a customer', 'error'); return; }
    this.saving = true;
    this.financeService.payment(this.payment).subscribe({
      next: () => { this.saving = false; this.toast.show('Payment recorded ✅', 'success'); this.showPayment = false; this.loadData();
          this.notif.notifyManagers('Payment Recorded', `${this.notif.currentUserName} recorded a payment of ₹${this.payment.amount}`, 'Info'); },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to record payment', 'error'); }
    });
  }

  saveExpense() {
    if (!this.expense.title) { this.toast.show('Title is required', 'error'); return; }
    this.saving = true;
    this.financeService.expense(this.expense).subscribe({
      next: () => { this.saving = false; this.toast.show('Expense added ✅', 'success'); this.showExpense = false; this.loadData(); },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add expense', 'error'); }
    });
  }

  saveSalary() {
    if (!this.salary.employeeId) { this.toast.show('Please select an employee', 'error'); return; }
    this.saving = true;
    this.financeService.salary(this.salary).subscribe({
      next: () => { this.saving = false; this.toast.show('Salary paid ✅', 'success'); this.showSalary = false; this.loadData();
          this.notif.notifyManagers('Salary Processed', `${this.notif.currentUserName} paid salary of ₹${this.salary.amount} to Employee #${this.salary.employeeId}`, 'Success'); },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to process salary', 'error'); }
    });
  }

  saveTax() {
    if (!this.tax.taxName) { this.toast.show('Tax name is required', 'error'); return; }
    this.saving = true;
    this.financeService.tax(this.tax).subscribe({
      next: () => { this.saving = false; this.toast.show('Tax recorded ✅', 'success'); this.showTax = false; this.loadData(); },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to record tax', 'error'); }
    });
  }

  generateInvoice() {
    if (!this.invoice.customerId) { this.toast.show('Please select a customer', 'error'); return; }
    this.saving = true;
    this.financeService.invoice(this.invoice).subscribe({
      next: () => { this.saving = false; this.toast.show('Invoice generated ✅', 'success'); this.showInvoice = false; this.loadData();
          this.notif.notifyManagers('Invoice Generated', `${this.notif.currentUserName} generated an invoice of ₹${this.invoice.amount}`, 'Info'); },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to generate invoice', 'error'); }
    });
  }

  get salaryBtnLabel() {
    if (this.loadingDropdowns) return 'Loading employees...';
    if (this.employees.length === 0) return 'No employees found';
    return '💼 Salary';
  }
}
