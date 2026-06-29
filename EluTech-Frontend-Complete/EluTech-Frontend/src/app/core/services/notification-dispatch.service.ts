import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationDispatchService {

  private managerIds: number[] = [];
  private loaded = false;

  constructor(private api: ApiService, private auth: AuthService) {}

  private loadManagerIds(): Promise<number[]> {
    if (this.loaded) return Promise.resolve(this.managerIds);
    return new Promise((resolve) => {
      this.api.get<number[]>('Notification/manager-ids').subscribe({
        next: (ids) => { this.managerIds = ids; this.loaded = true; resolve(ids); },
        error: () => resolve([])
      });
    });
  }

  async notifyManagers(title: string, message: string, type: 'Info' | 'Warning' | 'Success' | 'Error' = 'Info') {
    const ids = await this.loadManagerIds();
    // Don't notify yourself if you ARE the manager
    const myId = this.auth.userId();
    ids.filter(id => id !== myId).forEach(userId => {
      this.api.post('Notification', { userId, title, message, type }).subscribe({ error: () => {} });
    });
  }

  notifyUser(userId: number, title: string, message: string, type: 'Info' | 'Warning' | 'Success' | 'Error' = 'Info') {
    if (userId === this.auth.userId()) return; // Don't notify yourself
    this.api.post('Notification', { userId, title, message, type }).subscribe({ error: () => {} });
  }

  get currentUserName(): string { return this.auth.displayName(); }
  get currentRole(): string { return this.auth.role(); }
}
