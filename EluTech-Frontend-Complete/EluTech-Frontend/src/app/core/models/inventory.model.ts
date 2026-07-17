export interface Chemical {
  id: number;
  name: string;
  casNumber: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  expiryDate: string;
  lowStockDismissed: boolean;
  expiryDismissed: boolean;
  lastRestockedAt?: string;
  isDeleted: boolean;
}

export interface AddChemical {
  name: string;
  casNumber: string;
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
  isDeleted: boolean;
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
  isDeleted: boolean;
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
