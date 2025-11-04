export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface UserCreate {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export interface UserResponse {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface Purchase {
  id: number;
  user_id: number;
  sweet_id: number;
  quantity: number; // in kg
  price_per_kg: number;
  total_price: number;
  created_at: string;
}

