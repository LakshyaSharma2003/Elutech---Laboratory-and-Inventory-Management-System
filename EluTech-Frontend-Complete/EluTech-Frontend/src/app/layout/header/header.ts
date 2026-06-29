import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(public auth: AuthService, public theme: ThemeService) {}
  get name(): string { return this.auth.displayName(); }
  get role(): string { return this.auth.role(); }
  get initial(): string { return this.name.charAt(0).toUpperCase(); }
  logout() { this.auth.logout(); }
}
