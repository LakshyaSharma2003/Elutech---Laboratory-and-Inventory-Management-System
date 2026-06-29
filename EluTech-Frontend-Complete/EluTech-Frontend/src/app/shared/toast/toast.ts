import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toast.toasts()" class="toast" [ngClass]="t.type">
        <span class="icon">
          <ng-container *ngIf="t.type==='success'">✅</ng-container>
          <ng-container *ngIf="t.type==='error'">❌</ng-container>
          <ng-container *ngIf="t.type==='info'">ℹ️</ng-container>
        </span>
        <span class="msg">{{t.message}}</span>
        <button class="close" (click)="toast.remove(t.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 18px; border-radius: 14px;
      min-width: 280px; max-width: 380px;
      font-size: 14px; font-weight: 500;
      pointer-events: all;
      animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow: 0 8px 28px rgba(0,0,0,0.14);
      font-family: 'Inter', system-ui, sans-serif;
    }
    @keyframes toastIn {
      from { transform: translateX(110%) scale(0.95); opacity: 0; }
      to   { transform: translateX(0) scale(1); opacity: 1; }
    }
    .toast.success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
    .toast.error   { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
    .toast.info    { background: #EFF6FF; color: #1E3A8A; border: 1px solid #BFDBFE; }
    /* Glass theme toast */
    :host-context(body[data-theme="glass"]) .toast {
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.7) !important;
      box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 28px rgba(0,0,0,0.1) !important;
    }
    :host-context(body[data-theme="glass"]) .toast.success { background: rgba(236,253,245,0.8) !important; }
    :host-context(body[data-theme="glass"]) .toast.error   { background: rgba(254,242,242,0.8) !important; }
    :host-context(body[data-theme="glass"]) .toast.info    { background: rgba(239,246,255,0.8) !important; }
    /* Dark theme toast */
    :host-context(body[data-dark="true"]) .toast.success { background: #022C22; color: #6EE7B7; border-color: #065F46; }
    :host-context(body[data-dark="true"]) .toast.error   { background: #2D0A0A; color: #FCA5A5; border-color: #991B1B; }
    :host-context(body[data-dark="true"]) .toast.info    { background: #0C1A3A; color: #93C5FD; border-color: #1E3A8A; }
    .icon { font-size: 16px; flex-shrink: 0; }
    .msg  { flex: 1; line-height: 1.4; }
    .close { background: none; border: none; cursor: pointer; font-size: 18px; color: inherit; opacity: 0.6; padding: 0; line-height: 1; font-family: inherit; }
    .close:hover { opacity: 1; }
  `]
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
