import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { ProfitLoss, Invoice, Payment, Expense, Salary, Tax, GenerateInvoice } from '../models/finance.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FinanceService {

  private api = environment.apiUrl;

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getProfitLoss() {
    return this.apiService.get<ProfitLoss>('Finance/profit-loss');
  }

  getInvoices() {
    return this.apiService.get<Invoice[]>('Finance/invoices');
  }

  downloadInvoice(id: number) {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.api}/Finance/invoice/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
  }

  payment(data: Payment) { return this.apiService.post('Finance/payment', data); }
  expense(data: Expense) { return this.apiService.post('Finance/expense', data); }
  salary(data: Salary) { return this.apiService.post('Finance/salary', data); }
  tax(data: Tax) { return this.apiService.post('Finance/tax', data); }
  invoice(data: GenerateInvoice) { return this.apiService.post('Finance/invoice', data); }
}
