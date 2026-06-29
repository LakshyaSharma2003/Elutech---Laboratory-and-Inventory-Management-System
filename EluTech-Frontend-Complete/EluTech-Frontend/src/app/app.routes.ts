import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { managerGuard } from './core/guards/manager.guard';
import { financeGuard } from './core/guards/finance.guard';
import { employeeGuard } from './core/guards/employee.guard';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  /* AUTH */
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'otp', loadComponent: () => import('./features/auth/otp/otp').then(m => m.Otp) },
  { path: 'about', loadComponent: () => import('./features/about/about').then(m => m.About) },

  /* MAIN APP */
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [

      /* Dashboards */
      { path: 'manager', canActivate: [managerGuard], loadComponent: () => import('./features/dashboard/manager/manager').then(m => m.Manager) },
      { path: 'finance', canActivate: [financeGuard], loadComponent: () => import('./features/dashboard/finance/finance').then(m => m.Finance) },
      { path: 'employee', canActivate: [employeeGuard], loadComponent: () => import('./features/dashboard/employee/employee').then(m => m.Employee) },

      /* Modules */
      { path: 'employees', loadComponent: () => import('./features/employees/employees').then(m => m.Employees) },
      { path: 'attendance', loadComponent: () => import('./features/attendance/attendance').then(m => m.Attendance) },
      { path: 'samples', loadComponent: () => import('./features/samples/samples').then(m => m.Samples) },
      { path: 'customers', loadComponent: () => import('./features/customers/customers').then(m => m.Customers) },
      { path: 'finance-module', loadComponent: () => import('./features/finance/finance').then(m => m.Finance) },
      { path: 'inventory', loadComponent: () => import('./features/inventory/inventory').then(m => m.Inventory) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports').then(m => m.Reports) },
      { path: 'notifications', loadComponent: () => import('./features/notifications/notifications').then(m => m.Notifications) },
      { path: 'audit', loadComponent: () => import('./features/audit/audit').then(m => m.Audit) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings').then(m => m.Settings) },

    ]
  },

  { path: '**', redirectTo: 'login' }

];
