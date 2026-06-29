import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface CustomerItem {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  gstNumber: string;
}

export interface AddCustomerDto {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  gstNumber: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private api: ApiService) {}

  getCustomers(): Observable<CustomerItem[]> {
    return this.api.get<CustomerItem[]>('Customer');
  }

  addCustomer(data: AddCustomerDto) {
    return this.api.post('Customer', data);
  }
}
