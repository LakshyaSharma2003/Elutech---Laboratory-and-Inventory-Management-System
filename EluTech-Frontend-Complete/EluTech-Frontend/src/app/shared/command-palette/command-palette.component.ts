import { Component, OnInit, OnDestroy, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Command {
  id: string;
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  category: string;
  roles: string[];
  keywords: string[];
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cp-overlay" *ngIf="open()" (click)="close()">
      <div class="cp-dialog" (click)="$event.stopPropagation()">
        <div class="cp-search">
          <span class="cp-icon">⌘</span>
          <input #searchInput
            [(ngModel)]="query"
            (ngModelChange)="onQuery()"
            (keydown)="onKey($event)"
            placeholder="Search pages, actions…"
            autocomplete="off">
          <span class="cp-esc" (click)="close()">ESC</span>
        </div>
        <div class="cp-results" *ngIf="filtered().length > 0">
          <div *ngFor="let cmd of filtered(); let i = index"
            class="cp-item"
            [class.selected]="selectedIndex === i"
            (click)="run(cmd)"
            (mouseenter)="selectedIndex = i">
            <span class="cp-item-icon">{{cmd.icon}}</span>
            <div class="cp-item-body">
              <span class="cp-item-label">{{cmd.label}}</span>
              <span class="cp-item-cat">{{cmd.category}}</span>
            </div>
            <span class="cp-item-enter" *ngIf="selectedIndex === i">↵</span>
          </div>
        </div>
        <div class="cp-empty" *ngIf="query && filtered().length === 0">
          No results for "<b>{{query}}</b>"
        </div>
        <div class="cp-footer">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>ESC close</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cp-overlay {
      position: fixed; inset: 0;
      background: rgba(15,23,42,0.5);
      backdrop-filter: blur(8px);
      z-index: 9000;
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 140px;
      animation: fadeIn 0.15s ease both;
    }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    .cp-dialog {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      width: 560px; max-width: 92vw;
      overflow: hidden;
      animation: slideDown 0.22s cubic-bezier(0.34,1.3,0.64,1) both;
    }
    @keyframes slideDown { from { opacity:0; transform:scale(0.95) translateY(-12px) } to { opacity:1; transform:scale(1) translateY(0) } }
    .cp-search {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
    }
    .cp-icon { font-size: 18px; color: var(--text-muted); flex-shrink: 0; }
    .cp-search input {
      flex: 1; border: none; background: none; outline: none;
      font-size: 16px; color: var(--text); font-family: inherit;
      caret-color: var(--accent);
    }
    .cp-search input::placeholder { color: var(--text-disabled); }
    .cp-esc {
      font-size: 11px; font-weight: 700; color: var(--text-muted);
      background: var(--bg-subtle); border: 1px solid var(--border);
      padding: 2px 7px; border-radius: 6px; cursor: pointer;
      transition: all 0.15s ease;
    }
    .cp-esc:hover { background: var(--border); }
    .cp-results { max-height: 360px; overflow-y: auto; padding: 6px; }
    .cp-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: var(--radius);
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .cp-item.selected { background: var(--accent-soft); }
    .cp-item-icon { font-size: 18px; flex-shrink: 0; width: 24px; text-align: center; }
    .cp-item-body { flex: 1; display: flex; flex-direction: column; gap: 1px; }
    .cp-item-label { font-size: 14px; font-weight: 600; color: var(--text); }
    .cp-item-cat { font-size: 11px; color: var(--text-muted); }
    .cp-item-enter { font-size: 13px; color: var(--text-muted); }
    .cp-empty { padding: 28px; text-align: center; font-size: 14px; color: var(--text-muted); }
    .cp-empty b { color: var(--text); }
    .cp-footer {
      display: flex; gap: 16px; padding: 10px 20px;
      border-top: 1px solid var(--border);
      font-size: 11px; color: var(--text-disabled);
    }
  `]
})
export class CommandPaletteComponent implements OnInit, OnDestroy {

  open = signal(false);
  query = '';
  selectedIndex = 0;

  private allCommands: Command[] = [
    { id: 'dashboard',     label: 'Go to Dashboard',           icon: '⊞',  route: '/manager',        category: 'Navigation', roles: ['Manager'], keywords: ['home','dash'] },
    { id: 'fin-dash',      label: 'Go to Dashboard',           icon: '⊞',  route: '/finance',        category: 'Navigation', roles: ['FinanceOfficer'], keywords: ['home'] },
    { id: 'emp-dash',      label: 'Go to Dashboard',           icon: '⊞',  route: '/employee',       category: 'Navigation', roles: ['Employee'], keywords: ['home'] },
    { id: 'employees',     label: 'View Employees',            icon: '👥', route: '/employees',      category: 'Navigation', roles: ['Manager'], keywords: ['staff','team','people'] },
    { id: 'attendance',    label: 'Attendance',                icon: '📅', route: '/attendance',     category: 'Navigation', roles: ['Manager'], keywords: ['checkin','checkout'] },
    { id: 'samples',       label: 'View Samples',              icon: '🧪', route: '/samples',        category: 'Navigation', roles: ['Manager','Employee'], keywords: ['test','specimen'] },
    { id: 'customers',     label: 'Customers',                 icon: '🏢', route: '/customers',      category: 'Navigation', roles: ['Manager','FinanceOfficer'], keywords: ['client','company'] },
    { id: 'finance',       label: 'Finance Management',        icon: '💰', route: '/finance-module', category: 'Navigation', roles: ['FinanceOfficer'], keywords: ['payment','invoice','salary'] },
    { id: 'inventory',     label: 'Inventory',                 icon: '📦', route: '/inventory',      category: 'Navigation', roles: ['Manager'], keywords: ['chemicals','stock','supply'] },
    { id: 'reports',       label: 'Reports',                   icon: '📄', route: '/reports',        category: 'Navigation', roles: ['Manager','Employee'], keywords: ['document','upload'] },
    { id: 'notifications', label: 'Notifications',             icon: '🔔', route: '/notifications',  category: 'Navigation', roles: ['Manager','FinanceOfficer','Employee'], keywords: ['alerts','messages'] },
    { id: 'audit',         label: 'Audit Log',                 icon: '🔍', route: '/audit',          category: 'Navigation', roles: ['Manager'], keywords: ['history','log','activity'] },
    { id: 'settings',      label: 'Settings',                  icon: '⚙️', route: '/settings',       category: 'Navigation', roles: ['Manager','FinanceOfficer','Employee'], keywords: ['preferences','theme'] },
    { id: 'appearance',    label: 'Change Theme / Appearance', icon: '🎨', route: '/settings',       category: 'Settings',   roles: ['Manager','FinanceOfficer','Employee'], keywords: ['dark','light','color','glass'] },
    { id: 'password',      label: 'Change Password',           icon: '🔒', route: '/settings',       category: 'Settings',   roles: ['Manager','FinanceOfficer','Employee'], keywords: ['security','pw'] },
    { id: 'profile',       label: 'Edit Profile',              icon: '👤', route: '/settings',       category: 'Settings',   roles: ['Manager','FinanceOfficer','Employee'], keywords: ['name','email','phone'] },
    { id: 'about',         label: 'About EluTech',             icon: '🏛️', route: '/about',          category: 'Info',       roles: ['Manager','FinanceOfficer','Employee'], keywords: ['lab','company','info'] },
  ];

  filtered = computed(() => {
    const q = this.query.toLowerCase().trim();
    const role = this.auth.role();
    return this.allCommands
      .filter(c => c.roles.includes(role))
      .filter(c => !q || c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.keywords.some(k => k.includes(q)))
      .slice(0, 8);
  });

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {}
  ngOnDestroy() {}

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.open() ? this.close() : this.openPalette();
    }
    if (e.key === 'Escape' && this.open()) this.close();
  }

  openPalette() {
    this.query = '';
    this.selectedIndex = 0;
    this.open.set(true);
    setTimeout(() => document.querySelector<HTMLInputElement>('.cp-search input')?.focus(), 50);
  }

  close() { this.open.set(false); this.query = ''; }

  onQuery() { this.selectedIndex = 0; }

  onKey(e: KeyboardEvent) {
    const max = this.filtered().length;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.selectedIndex = (this.selectedIndex + 1) % max; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); this.selectedIndex = (this.selectedIndex - 1 + max) % max; }
    if (e.key === 'Enter')     { e.preventDefault(); const cmd = this.filtered()[this.selectedIndex]; if (cmd) this.run(cmd); }
  }

  run(cmd: Command) {
    this.close();
    if (cmd.route) this.router.navigate([cmd.route]);
    if (cmd.action) cmd.action();
  }
}
