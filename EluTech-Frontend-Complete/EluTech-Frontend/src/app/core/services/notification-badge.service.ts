import { Injectable, signal } from '@angular/core';
import { NotificationApiService } from './notification-api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationBadgeService {
  unreadCount = signal<number>(0);
  private interval: any;

  constructor(
    private notifApi: NotificationApiService,
    private auth: AuthService
  ) {}

  startPolling() {
    this.refresh();
    this.interval = setInterval(() => this.refresh(), 30000); // every 30s
  }

  stopPolling() {
    clearInterval(this.interval);
    this.unreadCount.set(0);
  }

  refresh() {
    const userId = this.auth.userId();
    if (!userId) return;
    this.notifApi.getNotifications(userId).subscribe({
      next: (items) => {
        this.unreadCount.set(items.filter(n => !n.isRead).length);
      },
      error: () => {}
    });
  }

  decrement(by = 1) {
    this.unreadCount.update(n => Math.max(0, n - by));
  }

  reset() { this.unreadCount.set(0); }
}
