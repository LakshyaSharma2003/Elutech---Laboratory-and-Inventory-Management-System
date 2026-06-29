import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, CustomerItem, AddCustomerDto } from '../../core/services/customer.service';
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
      next: (res) => { this.customers = res; this.filteredCustomers = res; this.loading = false; },
      error: () => { this.loading = false; this.toast.show('Failed to load customers', 'error'); }
    });
  }

  filterCustomers() {
    const v = this.search.toLowerCase();
    this.filteredCustomers = this.customers.filter(c =>
      c.name.toLowerCase().includes(v) ||
      c.email.toLowerCase().includes(v) ||
      c.gstNumber?.toLowerCase().includes(v)
    );
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
