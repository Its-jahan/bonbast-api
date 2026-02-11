export interface User {
  id: string;
  email: string;
  name: string;
}

export interface CurrencyData {
  [key: string]: string;
  usd: string;
  eur: string;
  gbp: string;
  try: string;
  aed: string;
  coin_azadi: string;
  coin_emami: string;
  coin_gerami: string;
  gold_18k: string;
  bitcoin: string;
  ethereum: string;
}

export interface ApiResponse {
  status: string;
  data: CurrencyData;
  last_updated: string;
}

export interface Currency {
  key: string;
  name: string;
  symbol: string;
  icon: string;
  category: 'currency' | 'gold' | 'coin' | 'crypto';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  monthlyRequests: number;
  apiType: 'all' | 'currencies' | 'gold' | 'coins' | 'crypto';
  features: string[];
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  productId: string;
  apiType: string;
  secretKey: string;
  name: string;
  price: number;
  requestUrl: string;
  monthlyLimit: number;
  usedRequests: number;
  resetDate: string;
  createdAt: string;
}
