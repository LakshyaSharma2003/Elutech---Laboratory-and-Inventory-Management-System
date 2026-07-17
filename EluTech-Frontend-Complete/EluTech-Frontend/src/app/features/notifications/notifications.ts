import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationApiService } from '../../core/services/notification-api.service';
import { Notification } from '../../core/models/notification.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationBadgeService } from '../../core/services/notification-badge.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  notifications: Notification[] = [];
  loading = true;

  constructor(
    private service: NotificationApiService,
    private auth: AuthService,
    private toast: ToastService,
    private badgeService: NotificationBadgeService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    const userId = this.auth.userId();
    if (!userId) {
      this.loading = false;
      this.toast.show('Could not determine user for notifications', 'error');
      return;
    }
    this.service.getNotifications(userId).subscribe({
      next: (res) => { this.notifications = res; this.loading = false; this.badgeService.refresh(); },
      error: () => { this.loading = false; this.toast.show('Failed to load notifications', 'error'); }
    });
  }

  markRead(id: number) {
    this.service.markRead(id).subscribe({
      next: () => {
        const item = this.notifications.find(n => n.id === id);
        if (item) item.isRead = true;
        this.toast.show('Marked as read', 'info');
      },
      error: () => this.toast.show('Failed to update', 'error')
    });
  }

  markAllRead() {
    this.notifications.filter(n => !n.isRead).forEach(n => this.markRead(n.id));
    this.badgeService.reset();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = { Info: 'ℹ️', Warning: '⚠️', Success: '✅', Error: '❌' };
    return map[type] || '🔔';
  }
}
