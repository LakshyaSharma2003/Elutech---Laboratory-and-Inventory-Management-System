import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../core/services/audit.service';
import { AuditLog } from '../../core/models/audit.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.html',
  styleUrl: './audit.css'
})
export class Audit implements OnInit {

  logs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  loading = true;
  search = '';

  constructor(private service: AuditService, private toast: ToastService) {}

  ngOnInit() { this.loadLogs(); }

  loadLogs() {
    this.loading = true;
    this.service.getLogs().subscribe({
      next: (res) => { this.logs = res; this.filteredLogs = res; this.loading = false; },
      error: () => { this.loading = false; this.toast.show('Failed to load audit logs', 'error'); }
    });
  }

  filterLogs() {
    const v = this.search.toLowerCase();
    this.filteredLogs = this.logs.filter(l =>
      l.action?.toLowerCase().includes(v) ||
      l.entityName?.toLowerCase().includes(v) ||
      l.ipAddress?.toLowerCase().includes(v)
    );
  }

  exportCSV() {
    const headers = ['ID', 'User ID', 'Action', 'Entity', 'IP Address', 'Timestamp'];
    const rows = this.filteredLogs.map(l => [l.id, l.userId ?? '', l.action, l.entityName ?? '', l.ipAddress ?? '', l.timestamp]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.show(`Exported ${this.filteredLogs.length} logs`, 'success');
  }
}
