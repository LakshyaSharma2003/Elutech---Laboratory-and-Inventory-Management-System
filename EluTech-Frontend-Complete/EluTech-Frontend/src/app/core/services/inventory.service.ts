import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Chemical, AddChemical, Machinery, AddMachinery, Consumable, AddConsumable, Purchase, AddPurchase } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private api: ApiService) {}

  getAllChemicals(): Observable<Chemical[]> {
    return this.api.get<Chemical[]>('Inventory/chemicals');
  }

  getLowStock(): Observable<Chemical[]> {
    return this.api.get<Chemical[]>('Inventory/low-stock');
  }

  getExpiring(): Observable<Chemical[]> {
    return this.api.get<Chemical[]>('Inventory/expiring');
  }

  getAllMachinery(): Observable<Machinery[]> {
    return this.api.get<Machinery[]>('Inventory/machinery');
  }

  getAllConsumables(): Observable<Consumable[]> {
    return this.api.get<Consumable[]>('Inventory/consumables');
  }

  getAllPurchases(): Observable<Purchase[]> {
    return this.api.get<Purchase[]>('Inventory/purchases');
  }

  addChemical(data: AddChemical) {
    return this.api.post('Inventory/chemical', data);
  }

  addMachinery(data: AddMachinery) {
    return this.api.post('Inventory/machinery', data);
  }

  addConsumable(data: AddConsumable) {
    return this.api.post('Inventory/consumable', data);
  }

  addPurchase(data: AddPurchase) {
    return this.api.post('Inventory/purchase', data);
  }

  restockChemical(id: number, addedQuantity: number) {
    return this.api.put(`Inventory/chemical/${id}/restock`, { addedQuantity });
  }

  dismissLowStock(id: number) {
    return this.api.put(`Inventory/chemical/${id}/dismiss-low-stock`, {});
  }

  dismissExpiry(id: number) {
    return this.api.put(`Inventory/chemical/${id}/dismiss-expiry`, {});
  }

  deleteChemical(id: number) {
    return this.api.delete(`Inventory/chemical/${id}`);
  }

  deleteMachinery(id: number) {
    return this.api.delete(`Inventory/machinery/${id}`);
  }

  deleteConsumable(id: number) {
    return this.api.delete(`Inventory/consumable/${id}`);
  }
}
