import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  currentPage = 'Dashboard';
  isDark = false;

  private readonly routeLabels: Record<string, string> = {
    '/manager':        'Dashboard',
    '/finance':        'Dashboard',
    '/employee':       'Dashboard',
    '/employees':      'Employees',
    '/attendance':     'Attendance',
    '/samples':        'Samples',
    '/customers':      'Customers',
    '/finance-module': 'Finance',
    '/inventory':      'Inventory',
    '/reports':        'Reports',
    '/notifications':  'Notifications',
    '/audit':          'Audit Log',
    '/settings':       'Settings',
    '/about':          'About EluTech',
  };

  private readonly darkThemes = ['dark-navy', 'dark-purple', 'dark-green', 'neon'];
  private readonly lightThemeFor: Record<string, string> = {
    'dark-navy':    'default',
    'dark-purple':  'violet',
    'dark-green':   'nature',
    'neon':         'ocean',
  };
  private readonly darkThemeFor: Record<string, string> = {
    'default': 'dark-navy',
    'violet':  'dark-purple',
    'nature':  'dark-green',
    'ocean':   'neon',
    'sunset':  'dark-navy',
    'rose':    'dark-purple',
    'slate':   'dark-navy',
    'glass':   'dark-navy',
  };

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Track current page for breadcrumb
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const path = e.urlAfterRedirects.split('?')[0];
      this.currentPage = this.routeLabels[path] || 'EluTech LIMS';
    });
    // Set initial
    const path = this.router.url.split('?')[0];
    this.currentPage = this.routeLabels[path] || 'EluTech LIMS';
    this.isDark = this.darkThemes.includes(this.theme.currentTheme());
  }

  toggleDark() {
    const current = this.theme.currentTheme();
    if (this.darkThemes.includes(current)) {
      const light = this.lightThemeFor[current] || 'default';
      this.theme.applyTheme(light);
      this.isDark = false;
    } else {
      const dark = this.darkThemeFor[current] || 'dark-navy';
      this.theme.applyTheme(dark);
      this.isDark = true;
    }
  }

  get name(): string    { return this.auth.displayName(); }
  get role(): string    { return this.auth.role(); }
  get initial(): string { return this.name.charAt(0).toUpperCase(); }
  logout() { this.auth.logout(); }
  openPalette() {
    // Dispatch keyboard event that CommandPaletteComponent listens for
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  }

}
