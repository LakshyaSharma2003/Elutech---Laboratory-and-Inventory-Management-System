import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, THEMES, Theme } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {

  activeSection: 'appearance' | 'profile' | 'password' | 'notifications' = 'appearance';

  themes = THEMES;
  lightThemes: Theme[] = [];
  darkThemes: Theme[] = [];

  // Profile form
  profile = { fullName: '', email: '', phoneNumber: '' };
  savingProfile = false;

  // Password form
  passwords = { currentPassword: '', newPassword: '', confirmPassword: '' };
  savingPassword = false;
  showCurrentPw = false;
  showNewPw = false;
  showConfirmPw = false;

  // Notification prefs (local only)
  notifPrefs = {
    systemAlerts: true,
    sampleUpdates: true,
    financeAlerts: true,
    emailDigest: false,
  };

  constructor(
    public themeService: ThemeService,
    public auth: AuthService,
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.lightThemes = this.themes.filter(t => !t.dark && t.id !== 'glass');
    this.darkThemes  = this.themes.filter(t =>  t.dark);
    // Pre-fill profile from JWT
    this.profile.fullName    = this.auth.displayName();
    this.profile.email       = this.auth.email();
    this.profile.phoneNumber = '';
    // Load notif prefs
    const saved = localStorage.getItem('elutech_notif_prefs');
    if (saved) try { this.notifPrefs = { ...this.notifPrefs, ...JSON.parse(saved) }; } catch {}
  }

  applyTheme(id: string) { this.themeService.applyTheme(id); }

  isActive(id: string): boolean { return this.themeService.currentTheme() === id; }

  saveProfile() {
    if (!this.profile.fullName.trim() || !this.profile.email.trim()) {
      this.toast.show('Name and email are required', 'error'); return;
    }
    this.savingProfile = true;
    this.api.put('Auth/update-profile', this.profile).subscribe({
      next: () => {
        this.savingProfile = false;
        this.toast.show('Profile updated successfully ✅', 'success');
      },
      error: (err) => {
        this.savingProfile = false;
        this.toast.show(err?.error?.message || 'Failed to update profile', 'error');
      }
    });
  }

  savePassword() {
    if (!this.passwords.currentPassword || !this.passwords.newPassword) {
      this.toast.show('All password fields are required', 'error'); return;
    }
    if (this.passwords.newPassword.length < 6) {
      this.toast.show('New password must be at least 6 characters', 'error'); return;
    }
    if (this.passwords.newPassword !== this.passwords.confirmPassword) {
      this.toast.show('New passwords do not match', 'error'); return;
    }
    if (this.passwords.currentPassword === this.passwords.newPassword) {
      this.toast.show('New password must be different from current password', 'error'); return;
    }
    this.savingPassword = true;
    this.api.put('Auth/change-password', {
      currentPassword: this.passwords.currentPassword,
      newPassword: this.passwords.newPassword
    }).subscribe({
      next: () => {
        this.savingPassword = false;
        this.passwords = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.toast.show('Password changed successfully ✅', 'success');
      },
      error: (err) => {
        this.savingPassword = false;
        this.toast.show(err?.error?.message || 'Failed to change password', 'error');
      }
    });
  }

  saveNotifPrefs() {
    localStorage.setItem('elutech_notif_prefs', JSON.stringify(this.notifPrefs));
    this.toast.show('Notification preferences saved ✅', 'success');
  }

  get pwStrength(): { label: string; pct: number; color: string } {
    const pw = this.passwords.newPassword;
    if (!pw) return { label: '', pct: 0, color: '#E2E8F0' };
    let score = 0;
    if (pw.length >= 6)  score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: 'Very Weak', pct: 15,  color: '#EF4444' },
      { label: 'Weak',      pct: 30,  color: '#F97316' },
      { label: 'Fair',      pct: 55,  color: '#F59E0B' },
      { label: 'Good',      pct: 75,  color: '#3B82F6' },
      { label: 'Strong',    pct: 100, color: '#10B981' },
    ];
    return map[Math.min(score, 4)];
  }
  get pwRule_minLength(): boolean { return this.passwords.newPassword.length >= 6; }
  get pwRule_uppercase(): boolean { return /[A-Z]/.test(this.passwords.newPassword); }
  get pwRule_number():    boolean { return /[0-9]/.test(this.passwords.newPassword); }
  get pwRule_special():   boolean { return /[^A-Za-z0-9]/.test(this.passwords.newPassword); }

}
