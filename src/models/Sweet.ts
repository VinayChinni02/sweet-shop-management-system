export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number; // Legacy field, kept for backward compatibility
  pricePerKilo?: number; // Price per kilogram
  quantity: number; // Quantity in stock (in kg)
  created_at?: string;
  updated_at?: string;
}

export interface SweetCreate {
  name: string;
  category: string;
  price?: number; // Legacy field
  pricePerKilo: number; // Required: price per kilogram
  quantity?: number; // Quantity in stock (in kg)
}

export interface SweetUpdate {
  name?: string;
  category?: string;
  price?: number; // Legacy field
  pricePerKilo?: number;
  quantity?: number;
}

export interface SearchFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

