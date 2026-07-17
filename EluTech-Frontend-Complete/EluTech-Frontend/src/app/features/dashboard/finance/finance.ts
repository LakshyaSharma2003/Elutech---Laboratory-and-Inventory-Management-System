import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NgApexchartsModule, ApexChart, ApexAxisChartSeries,
  ApexXAxis, ApexYAxis, ApexFill, ApexStroke, ApexGrid,
  ApexNonAxisChartSeries, ApexLegend, ApexDataLabels, ApexPlotOptions
} from 'ng-apexcharts';
import { DashboardService } from '../../../core/services/dashboard.service';
import { FinanceDashboard } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterModule],
  templateUrl: './finance.html',
  styleUrl: './finance.css'
})
export class Finance implements OnInit {

  today = new Date();
  loading = true;

  dashboard: FinanceDashboard = { revenue: 0, expenses: 0, salaries: 0, taxes: 0, profit: 0 };

  get cards() {
    return [
      { label: 'Total Revenue',  value: this.dashboard.revenue,  icon: '💰', cls: 'green',  prefix: '₹' },
      { label: 'Total Expenses', value: this.dashboard.expenses, icon: '🧾', cls: 'red',    prefix: '₹' },
      { label: 'Salaries Paid',  value: this.dashboard.salaries, icon: '💼', cls: 'blue',   prefix: '₹' },
      { label: 'Taxes Paid',     value: this.dashboard.taxes,    icon: '📋', cls: 'amber',  prefix: '₹' },
      { label: 'Net Profit',     value: this.dashboard.profit,   icon: '📈', cls: 'purple', prefix: '₹' },
    ];
  }

  // Revenue vs Expense monthly bar chart
  revExpSeries: ApexAxisChartSeries = [
    { name: 'Revenue', data: [42000, 55000, 48000, 60000, 75000, 82000] },
    { name: 'Expenses', data: [28000, 32000, 30000, 38000, 42000, 48000] }
  ];
  revExpChart: ApexChart = { type: 'bar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' };
  revExpXAxis: ApexXAxis = { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], labels: { style: { colors: '#94A3B8', fontSize: '12px' } }, axisBorder: { show: false }, axisTicks: { show: false } };
  revExpYAxis: ApexYAxis = { labels: { style: { colors: '#94A3B8', fontSize: '11px' }, formatter: (v: number) => `₹${(v/1000).toFixed(0)}k` } };
  revExpPlot: ApexPlotOptions = { bar: { borderRadius: 4, columnWidth: '60%' } };
  revExpColors = ['#10B981', '#EF4444'];
  revExpGrid: ApexGrid = { borderColor: '#F1F5F9', strokeDashArray: 4 };

  // Profit trend line
  profitSeries: ApexAxisChartSeries = [
    { name: 'Profit', data: [14000, 23000, 18000, 22000, 33000, 34000] }
  ];
  profitChart: ApexChart = { type: 'area', height: 200, toolbar: { show: false }, fontFamily: 'inherit' };
  profitXAxis: ApexXAxis = { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], labels: { style: { colors: '#94A3B8', fontSize: '12px' } }, axisBorder: { show: false }, axisTicks: { show: false } };
  profitFill: ApexFill = { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.02 } };
  profitStroke: ApexStroke = { curve: 'smooth', width: 2.5 };
  profitColors = ['#8B5CF6'];
  profitGrid: ApexGrid = { borderColor: '#F1F5F9', strokeDashArray: 4 };

  // Expense breakdown donut
  expBreakSeries: ApexNonAxisChartSeries = [48, 28, 14, 10];
  expBreakChart: ApexChart = { type: 'donut', height: 220, fontFamily: 'inherit' };
  expBreakLabels = ['Salaries', 'Operations', 'Taxes', 'Miscellaneous'];
  expBreakColors = ['#3B82F6', '#F59E0B', '#EF4444', '#94A3B8'];
  expBreakLegend: ApexLegend = { position: 'bottom', fontSize: '12px', fontFamily: 'inherit', labels: { colors: '#64748B' } };

  recentTransactions = [
    { desc: 'Payment from ABC Pharma', amount: 45000, type: 'credit', date: 'Today, 10:30 AM' },
    { desc: 'Salary — June 2026', amount: -180000, type: 'debit', date: 'Today, 9:00 AM' },
    { desc: 'GST Q2 2026', amount: -8500, type: 'debit', date: 'Yesterday, 4:15 PM' },
    { desc: 'Invoice INV-2026-031', amount: 22500, type: 'credit', date: 'Yesterday, 2:00 PM' },
    { desc: 'Lab Supplies Purchase', amount: -3200, type: 'debit', date: '24 Jun, 11:00 AM' },
    { desc: 'Payment from Sun Pharma', amount: 67000, type: 'credit', date: '23 Jun, 3:30 PM' },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() { this.loadDashboard(); }

  loadDashboard() {
    this.loading = true;
    this.dashboardService.getFinanceDashboard().subscribe({
      next: (res) => { this.dashboard = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get dayOfWeek(): string { return this.today.toLocaleDateString('en-IN', { weekday: 'long' }); }
  get formattedDate(): string { return this.today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
  fmt(v: number): string { return `₹${Math.abs(v).toLocaleString('en-IN')}`; }
}
