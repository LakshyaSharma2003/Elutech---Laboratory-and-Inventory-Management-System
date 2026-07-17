import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NgApexchartsModule,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexFill,
  ApexStroke,
  ApexTooltip,
  ApexYAxis,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive
} from 'ng-apexcharts';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ManagerDashboard } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterModule],
  templateUrl: './manager.html',
  styleUrl: './manager.css'
})
export class Manager implements OnInit, OnDestroy {
  private clockInterval: any;

  today = new Date();
  loading = true;

  dashboard: ManagerDashboard = {
    employees: 0,
    presentEmployees: 0,
    activeSamples: 0,
    pendingRequests: 0,
    pendingReports: 0,
    lowStockChemicals: 0
  };

  // Quick stats cards
  get cards() {
    return [
      { label: 'Total Employees',   value: this.dashboard.employees,         icon: '👥', cls: 'blue',   trend: '+2 this month' },
      { label: 'Present Today',     value: this.dashboard.presentEmployees,  icon: '✅', cls: 'green',  trend: 'Attendance rate' },
      { label: 'Active Samples',    value: this.dashboard.activeSamples,     icon: '🧪', cls: 'purple', trend: 'In progress' },
      { label: 'Pending Requests',  value: this.dashboard.pendingRequests,   icon: '⏳', cls: 'amber',  trend: 'Need approval' },
      { label: 'Pending Reports',   value: this.dashboard.pendingReports,    icon: '📄', cls: 'pink',   trend: 'Awaiting review' },
      { label: 'Low Stock Alerts',  value: this.dashboard.lowStockChemicals, icon: '⚠️', cls: 'red',    trend: 'Needs restocking' },
    ];
  }

  // Sample activity line chart
  sampleSeries: ApexAxisChartSeries = [
    { name: 'Samples Received', data: [8, 14, 10, 22, 18, 30, 26] },
    { name: 'Samples Completed', data: [5, 10, 8, 16, 14, 22, 20] }
  ];
  sampleChart: ApexChart = { type: 'area', height: 260, toolbar: { show: false }, fontFamily: 'inherit' };
  sampleXAxis: ApexXAxis = { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { style: { colors: '#94A3B8', fontSize: '12px' } }, axisBorder: { show: false }, axisTicks: { show: false } };
  sampleYAxis: ApexYAxis = { labels: { style: { colors: '#94A3B8', fontSize: '12px' } } };
  sampleFill: ApexFill = { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 } };
  sampleStroke: ApexStroke = { curve: 'smooth', width: 2.5 };
  sampleGrid: ApexGrid = { borderColor: '#F1F5F9', strokeDashArray: 4 };
  sampleColors = ['#3B82F6', '#10B981'];

  // Attendance donut chart
  attendanceSeries: ApexNonAxisChartSeries = [0, 0, 0, 0];
  attendanceChart: ApexChart = { type: 'donut', height: 260, fontFamily: 'inherit' };
  attendanceLabels = ['Present', 'Absent', 'Leave', 'Half Day'];
  attendanceColors = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];
  attendanceLegend: ApexLegend = { position: 'bottom', fontSize: '12px', fontFamily: 'inherit', labels: { colors: '#64748B' } };

  // Sample status bar chart
  statusSeries: ApexAxisChartSeries = [
    { name: 'Samples', data: [12, 8, 5, 15, 3] }
  ];
  statusChart: ApexChart = { type: 'bar', height: 220, toolbar: { show: false }, fontFamily: 'inherit' };
  statusXAxis: ApexXAxis = { categories: ['Received', 'Pre-treatment', 'Analysis', 'Reporting', 'Completed'], labels: { style: { colors: '#94A3B8', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } };
  statusPlot: ApexPlotOptions = { bar: { borderRadius: 6, columnWidth: '55%', distributed: true } };
  statusDataLabels: ApexDataLabels = { enabled: false };
  statusColors = ['#6366F1', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];
  statusGrid: ApexGrid = { borderColor: '#F1F5F9', strokeDashArray: 4 };

  recentActivities = [
    { action: 'New sample SMP-0092 received', time: '2 min ago', icon: '🧪', type: 'sample' },
    { action: 'Ravi Sharma marked present', time: '15 min ago', icon: '✅', type: 'attendance' },
    { action: 'Report RPT-045 approved', time: '1 hr ago', icon: '📄', type: 'report' },
    { action: 'Low stock alert: Sulfuric Acid', time: '2 hrs ago', icon: '⚠️', type: 'alert' },
    { action: 'Invoice INV-2026-031 generated', time: '3 hrs ago', icon: '💰', type: 'finance' },
    { action: 'New employee added: Priya Patel', time: 'Yesterday', icon: '👤', type: 'employee' },
  ];

  quickLinks = [
    { label: 'Mark Attendance', route: '/attendance', icon: '📅', color: '#3B82F6' },
    { label: 'Add Sample', route: '/samples', icon: '🧪', color: '#8B5CF6' },
    { label: 'View Reports', route: '/reports', icon: '📄', color: '#10B981' },
    { label: 'Inventory', route: '/inventory', icon: '📦', color: '#F59E0B' },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() { this.loadDashboard(); this.startClock(); }

  loadDashboard() {
    this.loading = true;
    this.dashboardService.getManagerDashboard().subscribe({
      next: (res) => {
        this.dashboard = res;
        this.loading = false;
        // Update attendance donut with real data
        const absent = Math.max(0, res.employees - res.presentEmployees);
        this.attendanceSeries = [res.presentEmployees, absent, 2, 1];
      },
      error: () => { this.loading = false; }
    });
  }

  get attendancePercent(): number {
    if (!this.dashboard.employees) return 0;
    return Math.round((this.dashboard.presentEmployees / this.dashboard.employees) * 100);
  }

  get dayOfWeek(): string {
    return this.today.toLocaleDateString('en-IN', { weekday: 'long' });
  }

  get formattedDate(): string {
    return this.today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  get greeting(): string {
    const h = this.today.getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  }

  private startClock() {
    this.clockInterval = setInterval(() => { this.today = new Date(); }, 1000);
  }
  ngOnDestroy() { clearInterval(this.clockInterval); }

  // Returns axis label color that works on both light and dark themes
  get axisColor(): string {
    return document.body.getAttribute('data-dark') === 'true' ? '#94A3B8' : '#64748B';
  }

}
