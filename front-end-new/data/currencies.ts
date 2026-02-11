import { Currency, Category } from '../types';

export const currencies: Currency[] = [
  // Currencies
  { key: 'usd', name: 'دلار آمریکا', symbol: 'USD', icon: '🇺🇸', category: 'currency' },
  { key: 'eur', name: 'یورو', symbol: 'EUR', icon: '🇪🇺', category: 'currency' },
  { key: 'gbp', name: 'پوند انگلیس', symbol: 'GBP', icon: '🇬🇧', category: 'currency' },
  { key: 'try', name: 'لیر ترکیه', symbol: 'TRY', icon: '🇹🇷', category: 'currency' },
  { key: 'aed', name: 'درهم امارات', symbol: 'AED', icon: '🇦🇪', category: 'currency' },
  
  // Gold
  { key: 'gold_18k', name: 'طلای 18 عیار', symbol: 'GOLD', icon: '✨', category: 'gold' },
  
  // Coins
  { key: 'coin_azadi', name: 'سکه تمام بهار آزادی', symbol: 'COIN', icon: '🪙', category: 'coin' },
  { key: 'coin_emami', name: 'سکه امامی', symbol: 'COIN', icon: '🪙', category: 'coin' },
  { key: 'coin_gerami', name: 'سکه گرمی', symbol: 'COIN', icon: '🪙', category: 'coin' },
  
  // Crypto
  { key: 'bitcoin', name: 'بیت کوین', symbol: 'BTC', icon: '₿', category: 'crypto' },
  { key: 'ethereum', name: 'اتریوم', symbol: 'ETH', icon: 'Ξ', category: 'crypto' },
];

export const categories: Category[] = [
  { id: 'all', name: 'همه', icon: '🌐' },
  { id: 'currency', name: 'ارزها', icon: '💵' },
  { id: 'gold', name: 'طلا', icon: '✨' },
  { id: 'coin', name: 'سکه', icon: '🪙' },
  { id: 'crypto', name: 'ارز دیجیتال', icon: '₿' },
];
