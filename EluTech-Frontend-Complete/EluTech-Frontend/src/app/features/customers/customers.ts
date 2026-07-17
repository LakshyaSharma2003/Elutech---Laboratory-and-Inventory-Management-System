import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, CustomerItem, AddCustomerDto } from '../../core/services/customer.service';
import { exportToCSV } from '../../core/utils/export.utils';
import { sortData, SortState } from '../../core/utils/sort.utils';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {

  search = '';
  customers: CustomerItem[] = [];
  filteredCustomers: CustomerItem[] = [];
  sort: SortState = { column: '', direction: 'none' };
  readonly sortIcons: Record<string, string> = { none: '⇅', asc: '↑', desc: '↓' };
  loading = true;
  showModal = false;
  saving = false;

  newCustomer: AddCustomerDto = {
    name: 'ABC Pharma Ltd',
    email: 'lab@abcpharma.com',
    phoneNumber: '9876543210',
    address: 'Jaipur, Rajasthan',
    gstNumber: 'GST27AABCA1234A1ZS'
  };

  constructor(
    private service: CustomerService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadCustomers(); }

  loadCustomers() {
    this.loading = true;
    this.service.getCustomers().subscribe({
      next: (res) => { this.customers = res; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; this.toast.show('Failed to load customers', 'error'); }
    });
  }

  applyFilter() {
    const v = this.search.toLowerCase();
    let result = !v ? [...this.customers] : this.customers.filter((c: CustomerItem) =>
      c.name.toLowerCase().includes(v) ||
      c.email.toLowerCase().includes(v) ||
      c.gstNumber?.toLowerCase().includes(v));
    this.filteredCustomers = sortData(result, this.sort);
  }
  filterCustomers() { this.applyFilter(); }
  setSort(col: string) {
    this.sort = this.sort.column === col
      ? { column: col, direction: this.sort.direction === 'asc' ? 'desc' : this.sort.direction === 'desc' ? 'none' : 'asc' }
      : { column: col, direction: 'asc' };
    this.applyFilter();
  }
  sortIcon(col: string) { return this.sort.column === col ? this.sortIcons[this.sort.direction] : this.sortIcons['none']; }
  exportCSV() {
    const rows = this.filteredCustomers.map(c => ({ ID: c.id, Name: c.name, Email: c.email, Phone: c.phoneNumber, GST: c.gstNumber, Address: c.address }));
    exportToCSV(rows, 'customers');
  }

  openModal() {
    this.newCustomer = {
      name: 'ABC Pharma Ltd',
      email: `lab${Date.now()}@abcpharma.com`,
      phoneNumber: '9876543210',
      address: 'Jaipur, Rajasthan',
      gstNumber: 'GST27AABCA1234A1ZS'
    };
    this.showModal = true;
  }

  saveCustomer() {
    if (!this.newCustomer.name?.trim() || !this.newCustomer.email?.trim()) {
      this.toast.show('Name and email are required', 'error'); return;
    }
    this.saving = true;
    this.service.addCustomer(this.newCustomer).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Customer added successfully! 🏢', 'success');
        this.showModal = false;
        this.loadCustomers();
      },
      error: (err) => {
        this.saving = false;
        this.toast.show(err?.error?.message || 'Failed to add customer', 'error');
      }
    });
  }
}
