import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuditLog } from '../models/audit.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
  constructor(private api: ApiService) {}

  getLogs(): Observable<AuditLog[]> {
    return this.api.get<AuditLog[]>('Audit');
  }
}
