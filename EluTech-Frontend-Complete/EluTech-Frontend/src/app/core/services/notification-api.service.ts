import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Notification, SendNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  constructor(private api: ApiService) {}

  getNotifications(userId: number): Observable<Notification[]> {
    return this.api.get<Notification[]>(`Notification/${userId}`);
  }

  markRead(id: number) {
    return this.api.put(`Notification/read/${id}`, {});
  }

  send(data: SendNotification) {
    return this.api.post('Notification', data);
  }
}
