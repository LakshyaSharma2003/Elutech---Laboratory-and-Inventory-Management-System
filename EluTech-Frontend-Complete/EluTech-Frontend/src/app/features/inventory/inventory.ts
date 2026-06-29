import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../core/services/inventory.service';
import {
  Chemical, AddChemical, Machinery, AddMachinery,
  Consumable, AddConsumable, Purchase, AddPurchase
} from '../../core/models/inventory.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {

  activeTab: 'chemicals' | 'machinery' | 'consumables' | 'purchases' = 'chemicals';
  activeModal: 'chemical' | 'machinery' | 'consumable' | 'purchase' | null = null;
  saving = false;

  chemicals: Chemical[] = [];
  lowStockIds: Set<number> = new Set();
  machineries: Machinery[] = [];
  consumables: Consumable[] = [];
  purchases: Purchase[] = [];

  loading = { chemicals: false, machinery: false, consumables: false, purchases: false };

  // Default form values (dummy data for quick testing)
  chemical: AddChemical = { name: '', casNumber: '', quantity: 0, unit: '', minimumStock: 0, expiryDate: '' };
  machinery: AddMachinery = { machineName: '', manufacturer: '', serialNumber: '' };
  consumable: AddConsumable = { name: '', quantity: 0, minimumStock: 0, unit: '' };
  purchase: AddPurchase = { itemName: '', amount: 0, vendor: '' };

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
        // Mark which ones are low stock
        this.service.getLowStock().subscribe({
          next: (low) => {
            this.lowStockIds = new Set(low.map(c => c.id));
            this.loading.chemicals = false;
          },
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
    if (type === 'chemical')   this.chemical   = { name: 'Sodium Hydroxide', casNumber: '1310-73-2', quantity: 50, unit: 'kg', minimumStock: 10, expiryDate: '2027-06-30' };
    if (type === 'machinery')  this.machinery  = { machineName: '', manufacturer: '', serialNumber: '' };
    if (type === 'consumable') this.consumable = { name: 'Pipette Tips 200μL', quantity: 200, minimumStock: 50, unit: 'Box' };
    if (type === 'purchase')   this.purchase   = { itemName: '', amount: 0, vendor: '' };
  }

  closeModal() { this.activeModal = null; }

  saveChemical() {
    if (!this.chemical.name?.trim()) { this.toast.show('Chemical name is required', 'error'); return; }
    this.saving = true;
    this.service.addChemical(this.chemical).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Chemical added ✅', 'success');
        this.closeModal();
        this.loadChemicals();
        this.activeTab = 'chemicals';
      },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add chemical', 'error'); }
    });
  }

  saveMachinery() {
    if (!this.machinery.machineName?.trim()) { this.toast.show('Machine name is required', 'error'); return; }
    this.saving = true;
    this.service.addMachinery(this.machinery).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Machinery added ✅', 'success');
        this.closeModal();
        this.loadMachinery();
        this.activeTab = 'machinery';
      },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add machinery', 'error'); }
    });
  }

  saveConsumable() {
    if (!this.consumable.name?.trim()) { this.toast.show('Item name is required', 'error'); return; }
    this.saving = true;
    this.service.addConsumable(this.consumable).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Consumable added ✅', 'success');
        this.closeModal();
        this.loadConsumables();
        this.activeTab = 'consumables';
      },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to add consumable', 'error'); }
    });
  }

  savePurchase() {
    if (!this.purchase.itemName?.trim() || !this.purchase.vendor?.trim()) { this.toast.show('Item name and vendor are required', 'error'); return; }
    this.saving = true;
    this.service.addPurchase(this.purchase).subscribe({
      next: () => {
        this.saving = false;
        this.toast.show('Purchase recorded ✅', 'success');
        this.closeModal();
        this.loadPurchases();
        this.activeTab = 'purchases';
      },
      error: (err) => { this.saving = false; this.toast.show(err?.error?.message || 'Failed to record purchase', 'error'); }
    });
  }

  isLowStock(chemical: Chemical): boolean {
    return this.lowStockIds.has(chemical.id);
  }

  get lowStockCount(): number { return this.lowStockIds.size; }
}
