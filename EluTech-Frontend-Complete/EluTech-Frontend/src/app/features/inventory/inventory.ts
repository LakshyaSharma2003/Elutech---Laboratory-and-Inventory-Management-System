import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../core/services/inventory.service';
import {
  Chemical, AddChemical, Machinery, AddMachinery,
  Consumable, AddConsumable, Purchase, AddPurchase
} from '../../core/models/inventory.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {

  activeTab: 'chemicals' | 'machinery' | 'consumables' | 'purchases' = 'chemicals';
  activeModal: 'chemical' | 'machinery' | 'consumable' | 'purchase' | null = null;
  saving = false;

  chemicals: Chemical[] = [];
  lowStockIds: Set<number> = new Set();
  expiringIds: Set<number> = new Set();
  machineries: Machinery[] = [];
  consumables: Consumable[] = [];
  purchases: Purchase[] = [];

  loading = { chemicals: false, machinery: false, consumables: false, purchases: false };

  chemical: AddChemical = { name: '', casNumber: '', quantity: 0, unit: '', minimumStock: 0, expiryDate: '' };
  machinery: AddMachinery = { machineName: '', manufacturer: '', serialNumber: '' };
  consumable: AddConsumable = { name: '', quantity: 0, minimumStock: 0, unit: '' };
  purchase: AddPurchase = { itemName: '', amount: 0, vendor: '' };

  // Restock modal
  showRestockModal = false;
  restockTarget: Chemical | null = null;
  restockAmount = 0;

  // Delete confirmation
  showConfirmDelete = false;
  deleteTarget: { type: 'chemical' | 'machinery' | 'consumable'; id: number; name: string } | null = null;

  constructor(private service: InventoryService, private toast: ToastService) {}

  ngOnInit() {
    this.loadChemicals();
    this.loadMachinery();
    this.loadConsumables();
    this.loadPurchases();
  }

  loadChemicals() {
    this.loading.chemicals = true;
    this.service.getAllChemicals().subscribe({
      next: (res) => {
        this.chemicals = res;
        this.service.getLowStock().subscribe({
          next: (low) => { this.lowStockIds = new Set(low.map(c => c.id)); },
          error: () => {}
        });
        this.service.getExpiring().subscribe({
          next: (exp) => { this.expiringIds = new Set(exp.map(c => c.id)); this.loading.chemicals = false; },
          error: () => { this.loading.chemicals = false; }
        });
      },
      error: () => { this.loading.chemicals = false; this.toast.show('Failed to load chemicals', 'error'); }
    });
  }

  loadMachinery() {
    this.loading.machinery = true;
    this.service.getAllMachinery().subscribe({
      next: (res) => { this.machineries = res; this.loading.machinery = false; },
      error: () => { this.loading.machinery = false; }
    });
  }

  loadConsumables() {
    this.loading.consumables = true;
    this.service.getAllConsumables().subscribe({
      next: (res) => { this.consumables = res; this.loading.consumables = false; },
      error: () => { this.loading.consumables = false; }
    });
  }

  loadPurchases() {
    this.loading.purchases = true;
    this.service.getAllPurchases().subscribe({
      next: (res) => { this.purchases = res; this.loading.purchases = false; },
      error: () => { this.loading.purchases = false; }
    });
  }

  openModal(type: typeof this.activeModal) {
    this.activeModal = type;
    this.saving = false;
    if (type === 'chemical')   this.chemical   = { name: '', casNumber: '', quantity: 0, unit: '', minimumStock: 0, expiryDate: '' };
    if (type === 'machinery')  this.machinery  = { machineName: '', manufacturer: '', serialNumber: '' };
    if (type === 'consumable') this.consumable = { name: '', quantity: 0, minimumStock: 0, unit: '' };
    if (type === 'purchase')   this.purchase   = { itemName: '', amount: 0, vendor: '' };
  }

  closeModal() { this.activeModal = null; }

  saveChemical() {
    if (!this.chemical.name?.trim()) { this.toast.show('Chemical name is required', 'error'); return; }
    if (!this.chemical.expiryDate) { this.toast.show('Expiry date is required', 'error'); return; }
    this.saving = true;
    this.service.addChemical(this.chemical).subscribe({
      next: () => { this.saving = false; this.toast.show('Chemical added ✅', 'success'); this.closeModal(); this.loadChemicals(); this.activeTab = 'chemicals'; },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add chemical', 'error'); }
    });
  }

  saveMachinery() {
    if (!this.machinery.machineName?.trim()) { this.toast.show('Machine name is required', 'error'); return; }
    this.saving = true;
    this.service.addMachinery(this.machinery).subscribe({
      next: () => { this.saving = false; this.toast.show('Machinery added ✅', 'success'); this.closeModal(); this.loadMachinery(); this.activeTab = 'machinery'; },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add machinery', 'error'); }
    });
  }

  saveConsumable() {
    if (!this.consumable.name?.trim()) { this.toast.show('Item name is required', 'error'); return; }
    this.saving = true;
    this.service.addConsumable(this.consumable).subscribe({
      next: () => { this.saving = false; this.toast.show('Consumable added ✅', 'success'); this.closeModal(); this.loadConsumables(); this.activeTab = 'consumables'; },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add consumable', 'error'); }
    });
  }

  savePurchase() {
    if (!this.purchase.itemName?.trim() || !this.purchase.vendor?.trim()) { this.toast.show('Item name and vendor are required', 'error'); return; }
    this.saving = true;
    this.service.addPurchase(this.purchase).subscribe({
      next: () => { this.saving = false; this.toast.show('Purchase recorded ✅', 'success'); this.closeModal(); this.loadPurchases(); this.activeTab = 'purchases'; },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to record purchase', 'error'); }
    });
  }

  isLowStock(chemical: Chemical): boolean { return this.lowStockIds.has(chemical.id); }
  isExpiring(chemical: Chemical): boolean { return this.expiringIds.has(chemical.id); }

  daysToExpiry(expiryDate: string): number {
    const diff = new Date(expiryDate).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  get lowStockCount(): number { return this.lowStockIds.size; }
  get expiringCount(): number { return this.expiringIds.size; }

  // ── Restock flow ──
  openRestock(chemical: Chemical) {
    this.restockTarget = chemical;
    this.restockAmount = 0;
    this.showRestockModal = true;
  }

  confirmRestock() {
    if (!this.restockTarget) return;
    this.service.restockChemical(this.restockTarget.id, this.restockAmount).subscribe({
      next: () => {
        this.toast.show('Marked as restocked ✅ Alerts cleared', 'success');
        this.showRestockModal = false;
        this.loadChemicals();
      },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to restock', 'error')
    });
  }

  // ── Dismiss (mute) alerts without changing stock ──
  dismissLowStock(chemical: Chemical) {
    this.service.dismissLowStock(chemical.id).subscribe({
      next: () => { this.toast.show('Low stock alert muted for this chemical', 'info'); this.loadChemicals(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to dismiss', 'error')
    });
  }

  dismissExpiry(chemical: Chemical) {
    this.service.dismissExpiry(chemical.id).subscribe({
      next: () => { this.toast.show('Expiry alert muted for this chemical', 'info'); this.loadChemicals(); },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to dismiss', 'error')
    });
  }

  // ── Soft delete ──
  askDelete(type: 'chemical' | 'machinery' | 'consumable', id: number, name: string) {
    this.deleteTarget = { type, id, name };
    this.showConfirmDelete = true;
  }

  confirmDelete() {
    if (!this.deleteTarget) return;
    this.showConfirmDelete = false;
    const { type, id } = this.deleteTarget;

    const obs = type === 'chemical' ? this.service.deleteChemical(id)
              : type === 'machinery' ? this.service.deleteMachinery(id)
              : this.service.deleteConsumable(id);

    obs.subscribe({
      next: () => {
        this.toast.show('Item removed', 'info');
        if (type === 'chemical') this.loadChemicals();
        if (type === 'machinery') this.loadMachinery();
        if (type === 'consumable') this.loadConsumables();
      },
      error: (err) => this.toast.show(err?.error?.message || 'Failed to remove item', 'error')
    });
  }
}
