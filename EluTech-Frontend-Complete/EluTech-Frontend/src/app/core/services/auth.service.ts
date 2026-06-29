import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from './api.service';
import { AuthResponse } from '../models/auth-response.model';

// ASP.NET Core serializes ClaimTypes to these URI keys in JWT
const CLAIM_NAMEID = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_NAME   = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const CLAIM_EMAIL  = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const CLAIM_ROLE   = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user = signal<any>(null);
  token = signal<string>('');

  constructor(private api: ApiService, private router: Router) {
    this.loadUser();
  }

  login(email: string, password: string) {
    return this.api.post('Auth/login', { email, password });
  }

  saveUser(response: AuthResponse) {
    localStorage.setItem('token', response.token);
    if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken);
    this.token.set(response.token);
    const decoded = jwtDecode<any>(response.token);
    this.user.set(decoded);
  }

  loadUser() {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.token.set(token);
    try {
      this.user.set(jwtDecode<any>(token));
    } catch {}
  }

  logout() {
    // Preserve inventory localStorage keys when logging out
    const machinery   = localStorage.getItem('elutech_machinery');
    const consumables = localStorage.getItem('elutech_consumables');
    const purchases   = localStorage.getItem('elutech_purchases');

    localStorage.clear();

    // Restore inventory data
    if (machinery)   localStorage.setItem('elutech_machinery', machinery);
    if (consumables) localStorage.setItem('elutech_consumables', consumables);
    if (purchases)   localStorage.setItem('elutech_purchases', purchases);

    this.user.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  role(): string {
    const u = this.user();
    return u?.[CLAIM_ROLE] || u?.role || '';
  }

  // Returns User.Id (from ClaimTypes.NameIdentifier in JWT)
  userId(): number {
    const u = this.user();
    const raw = u?.[CLAIM_NAMEID] || u?.nameid || u?.sub || '0';
    return Number(raw);
  }

  // Returns display name (from ClaimTypes.Name)
  displayName(): string {
    const u = this.user();
    return u?.[CLAIM_NAME] || u?.name || u?.unique_name || 'User';
  }

  email(): string {
    const u = this.user();
    return u?.[CLAIM_EMAIL] || u?.email || '';
  }
}
