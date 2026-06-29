import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private api: ApiService) {}

  getEmployees(): Observable<Employee[]> {
    return this.api.get<Employee[]>('Employee');
  }

  addEmployee(data: any) {
    return this.api.post('Employee', data);
  }

  fireEmployee(id: number) {
    return this.api.put(`Employee/terminate/${id}`, {});
  }

  // Returns { employeeId, userId } for the currently logged-in user
  getMyEmployeeId(): Observable<{ employeeId: number; userId: number }> {
    return this.api.get<{ employeeId: number; userId: number }>('Employee/my-id');
  }
}
