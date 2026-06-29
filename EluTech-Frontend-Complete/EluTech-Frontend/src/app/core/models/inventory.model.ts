export interface Chemical {
  id: number;
  name: string;
  casNumber: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  expiryDate: string;
}

export interface AddChemical {
  name: string;
  casNumber: string;  // maps to backend CASNumber via camelCase
  quantity: number;
  unit: string;
  minimumStock: number;
  expiryDate: string;
}

export interface Machinery {
  id: number;
  machineName: string;
  manufacturer: string;
  serialNumber: string;
  isActive: boolean;
  purchaseDate: string;
}

export interface AddMachinery {
  machineName: string;
  manufacturer: string;
  serialNumber: string;
}

export interface Consumable {
  id: number;
  name: string;
  quantity: number;
  minimumStock: number;
  unit: string;
}

export interface AddConsumable {
  name: string;
  quantity: number;
  minimumStock: number;
  unit: string;
}

export interface Purchase {
  id: number;
  itemName: string;
  amount: number;
  vendor: string;
  purchaseDate: string;
}

export interface AddPurchase {
  itemName: string;
  amount: number;
  vendor: string;
}
