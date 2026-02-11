import { CurrencyItem } from '../types';

export const currencies: CurrencyItem[] = [
  // Popular Currencies
  { key: 'usd', name: 'دلار آمریکا', symbol: 'USD', flag: '🇺🇸', category: 'currency' },
  { key: 'eur', name: 'یورو', symbol: 'EUR', flag: '🇪🇺', category: 'currency' },
  { key: 'gbp', name: 'پوند انگلیس', symbol: 'GBP', flag: '🇬🇧', category: 'currency' },
  { key: 'cad', name: 'دلار کانادا', symbol: 'CAD', flag: '🇨🇦', category: 'currency' },
  { key: 'aud', name: 'دلار استرالیا', symbol: 'AUD', flag: '🇦🇺', category: 'currency' },
  { key: 'chf', name: 'فرانک سوئیس', symbol: 'CHF', flag: '🇨🇭', category: 'currency' },
  { key: 'cny', name: 'یوان چین', symbol: 'CNY', flag: '🇨🇳', category: 'currency' },
  { key: 'jpy', name: 'ین ژاپن', symbol: 'JPY', flag: '🇯🇵', category: 'currency' },

  // Middle East Currencies
  { key: 'aed', name: 'درهم امارات', symbol: 'AED', flag: '🇦🇪', category: 'currency' },
  { key: 'sar', name: 'ریال سعودی', symbol: 'SAR', flag: '🇸🇦', category: 'currency' },
  { key: 'kwd', name: 'دینار کویت', symbol: 'KWD', flag: '🇰🇼', category: 'currency' },
  { key: 'bhd', name: 'دینار بحرین', symbol: 'BHD', flag: '🇧🇭', category: 'currency' },
  { key: 'qar', name: 'ریال قطر', symbol: 'QAR', flag: '🇶🇦', category: 'currency' },
  { key: 'omr', name: 'ریال عمان', symbol: 'OMR', flag: '🇴🇲', category: 'currency' },
  { key: 'iqd', name: 'دینار عراق', symbol: 'IQD', flag: '🇮🇶', category: 'currency' },
  { key: 'try', name: 'لیر ترکیه', symbol: 'TRY', flag: '🇹🇷', category: 'currency' },

  // Other Currencies
  { key: 'inr', name: 'روپیه هند', symbol: 'INR', flag: '🇮🇳', category: 'currency' },
  { key: 'rub', name: 'روبل روسیه', symbol: 'RUB', flag: '🇷🇺', category: 'currency' },
  { key: 'azn', name: 'منات آذربایجان', symbol: 'AZN', flag: '🇦🇿', category: 'currency' },
  { key: 'afn', name: 'افغانی افغانستان', symbol: 'AFN', flag: '🇦🇫', category: 'currency' },
  { key: 'amd', name: 'درام ارمنستان', symbol: 'AMD', flag: '🇦🇲', category: 'currency' },
  { key: 'dkk', name: 'کرون دانمارک', symbol: 'DKK', flag: '🇩🇰', category: 'currency' },
  { key: 'hkd', name: 'دلار هنگ کنگ', symbol: 'HKD', flag: '🇭🇰', category: 'currency' },
  { key: 'myr', name: 'رینگیت مالزی', symbol: 'MYR', flag: '🇲🇾', category: 'currency' },
  { key: 'nok', name: 'کرون نروژ', symbol: 'NOK', flag: '🇳🇴', category: 'currency' },
  { key: 'sek', name: 'کرون سوئد', symbol: 'SEK', flag: '🇸🇪', category: 'currency' },
  { key: 'sgd', name: 'دلار سنگاپور', symbol: 'SGD', flag: '🇸🇬', category: 'currency' },
  { key: 'thb', name: 'بات تایلند', symbol: 'THB', flag: '🇹🇭', category: 'currency' },

  // Gold
  { key: 'gold_ounce', name: 'اونس طلا', symbol: 'اونس', category: 'gold' },
  { key: 'gold_gram_18k', name: 'طلای ۱۸ عیار', symbol: 'گرم', category: 'gold' },
  { key: 'gold_mithqal', name: 'مثقال طلا', symbol: 'مثقال', category: 'gold' },

  // Coins
  { key: 'coin_azadi', name: 'سکه تمام', symbol: 'سکه', category: 'coin' },
  { key: 'coin_emami', name: 'سکه امامی', symbol: 'سکه', category: 'coin' },
  { key: 'coin_half', name: 'نیم سکه', symbol: 'سکه', category: 'coin' },
  { key: 'coin_quarter', name: 'ربع سکه', symbol: 'سکه', category: 'coin' },
  { key: 'coin_gram', name: 'سکه گرمی', symbol: 'سکه', category: 'coin' },

  // Crypto
  { key: 'bitcoin', name: 'بیت کوین', symbol: 'BTC', category: 'crypto' },
];

export const categories = [
  { id: 'all', name: 'همه', icon: '🌐' },
  { id: 'currency', name: 'ارزها', icon: '💵' },
  { id: 'gold', name: 'طلا', icon: '🥇' },
  { id: 'coin', name: 'سکه', icon: '🪙' },
  { id: 'crypto', name: 'ارز دیجیتال', icon: '₿' },
];

