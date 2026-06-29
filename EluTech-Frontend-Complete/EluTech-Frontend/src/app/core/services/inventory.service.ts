import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Chemical, AddChemical, Machinery, AddMachinery, Consumable, AddConsumable, Purchase, AddPurchase } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private api: ApiService) {}

  // GET all chemicals (any stock level)
  getAllChemicals(): Observable<Chemical[]> {
    return this.api.get<Chemical[]>('Inventory/chemicals');
  }

  // GET low stock only
  getLowStock(): Observable<Chemical[]> {
    return this.api.get<Chemical[]>('Inventory/low-stock');
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
}
