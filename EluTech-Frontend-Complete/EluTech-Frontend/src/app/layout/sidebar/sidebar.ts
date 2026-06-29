import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { LiquidGlassDirective } from '../../shared/liquid-glass/liquid-glass.directive';

interface MenuItem {
  title: string; route: string; icon: string; roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LiquidGlassDirective],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  allMenus: MenuItem[] = [
    { title: 'Dashboard',     route: '/manager',        icon: '⊞',  roles: ['Manager'] },
    { title: 'Dashboard',     route: '/finance',        icon: '⊞',  roles: ['FinanceOfficer'] },
    { title: 'Dashboard',     route: '/employee',       icon: '⊞',  roles: ['Employee'] },
    { title: 'Employees',     route: '/employees',      icon: '👥', roles: ['Manager'] },
    { title: 'Attendance',    route: '/attendance',     icon: '📅', roles: ['Manager'] },
    { title: 'Samples',       route: '/samples',        icon: '🧪', roles: ['Manager', 'Employee'] },
    { title: 'Customers',     route: '/customers',      icon: '🏢', roles: ['Manager', 'FinanceOfficer'] },
    { title: 'Finance',       route: '/finance-module', icon: '💰', roles: ['FinanceOfficer'] },
    { title: 'Inventory',     route: '/inventory',      icon: '📦', roles: ['Manager'] },
    { title: 'Reports',       route: '/reports',        icon: '📄', roles: ['Manager', 'Employee'] },
    { title: 'Notifications', route: '/notifications',  icon: '🔔', roles: ['Manager', 'FinanceOfficer', 'Employee'] },
    { title: 'Audit',         route: '/audit',          icon: '🔍', roles: ['Manager'] },
    { title: 'Settings',      route: '/settings',       icon: '⚙️', roles: ['Manager', 'FinanceOfficer', 'Employee'] },
    { title: 'About EluTech',  route: '/about',          icon: '🏛️', roles: ['Manager', 'FinanceOfficer', 'Employee'] },
  ];

  menus = computed(() => {
    const role = this.auth.role();
    return this.allMenus.filter(m => m.roles.includes(role));
  });

  constructor(public auth: AuthService, public theme: ThemeService) {}
}
