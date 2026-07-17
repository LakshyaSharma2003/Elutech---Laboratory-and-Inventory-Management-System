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
    if (ids.length === 0) {
      console.warn('[Notifications] No manager user IDs found — cannot deliver notification:', title);
      return;
    }
    const myId = this.auth.userId();
    ids.filter(id => id !== myId).forEach(userId => {
      this.api.post('Notification', { userId, title, message, type }).subscribe({
        error: (err) => console.error('[Notifications] Failed to notify manager', userId, err)
      });
    });
  }

  notifyUser(userId: number, title: string, message: string, type: 'Info' | 'Warning' | 'Success' | 'Error' = 'Info') {
    if (!userId) { console.warn('[Notifications] notifyUser called with invalid userId for:', title); return; }
    if (userId === this.auth.userId()) return; // Don't notify yourself
    this.api.post('Notification', { userId, title, message, type }).subscribe({
      error: (err) => console.error('[Notifications] Failed to notify user', userId, err)
    });
  }

  get currentUserName(): string { return this.auth.displayName(); }
  get currentRole(): string { return this.auth.role(); }
}
