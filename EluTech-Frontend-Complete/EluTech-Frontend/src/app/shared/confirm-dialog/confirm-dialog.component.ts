import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" *ngIf="visible" (click)="cancel()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <div class="dialog-icon" [ngClass]="type">
          <ng-container *ngIf="type === 'danger'">⚠️</ng-container>
          <ng-container *ngIf="type === 'warning'">❓</ng-container>
          <ng-container *ngIf="type === 'info'">ℹ️</ng-container>
        </div>
        <h3>{{title}}</h3>
        <p>{{message}}</p>
        <div class="actions">
          <button class="btn-cancel" (click)="cancel()">{{cancelLabel}}</button>
          <button class="btn-confirm" [ngClass]="type" (click)="confirm()">{{confirmLabel}}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed; inset: 0;
      background: rgba(15,23,42,0.45);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.18s ease both;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .dialog {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 32px 28px;
      width: 380px; max-width: 92vw;
      text-align: center;
      box-shadow: var(--shadow-xl);
      animation: scaleIn 0.22s cubic-bezier(0.34,1.3,0.64,1) both;
    }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
    .dialog-icon { font-size: 40px; margin-bottom: 14px; }
    h3 { font-size: 17px; font-weight: 800; color: var(--text); margin: 0 0 8px; }
    p  { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 24px; }
    .actions { display: flex; gap: 10px; justify-content: center; }
    .btn-cancel {
      padding: 10px 22px;
      background: var(--bg-subtle); color: var(--text-secondary);
      border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;
      transition: all 0.2s ease;
    }
    .btn-cancel:hover { background: var(--border); }
    .btn-confirm {
      padding: 10px 22px;
      border: none; border-radius: var(--radius-sm);
      font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
      transition: all 0.2s ease;
    }
    .btn-confirm.danger  { background: #EF4444; color: white; }
    .btn-confirm.danger:hover  { background: #DC2626; transform: translateY(-1px); }
    .btn-confirm.warning { background: var(--badge-warn-text); color: white; }
    .btn-confirm.warning:hover { filter: brightness(0.9); }
    .btn-confirm.info    { background: var(--primary); color: white; }
    .btn-confirm.info:hover    { background: var(--primary-hover); }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel  = 'Cancel';
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() { this.confirmed.emit(); }
  cancel()  { this.cancelled.emit(); }
}
