import { CurrencyItem } from '../types';

export const currencies: CurrencyItem[] = [
  // Popular Currencies
  { key: 'usd', nameEn: 'US Dollar', nameFa: 'دلار آمریکا', symbol: 'USD', flag: '🇺🇸', category: 'currency' },
  { key: 'eur', nameEn: 'Euro', nameFa: 'یورو', symbol: 'EUR', flag: '🇪🇺', category: 'currency' },
  { key: 'gbp', nameEn: 'British Pound', nameFa: 'پوند انگلیس', symbol: 'GBP', flag: '🇬🇧', category: 'currency' },
  { key: 'cad', nameEn: 'Canadian Dollar', nameFa: 'دلار کانادا', symbol: 'CAD', flag: '🇨🇦', category: 'currency' },
  { key: 'aud', nameEn: 'Australian Dollar', nameFa: 'دلار استرالیا', symbol: 'AUD', flag: '🇦🇺', category: 'currency' },
  { key: 'chf', nameEn: 'Swiss Franc', nameFa: 'فرانک سوئیس', symbol: 'CHF', flag: '🇨🇭', category: 'currency' },
  { key: 'cny', nameEn: 'Chinese Yuan', nameFa: 'یوان چین', symbol: 'CNY', flag: '🇨🇳', category: 'currency' },
  { key: 'jpy', nameEn: 'Japanese Yen', nameFa: 'ین ژاپن', symbol: 'JPY', flag: '🇯🇵', category: 'currency' },

  // Middle East Currencies
  { key: 'aed', nameEn: 'UAE Dirham', nameFa: 'درهم امارات', symbol: 'AED', flag: '🇦🇪', category: 'currency' },
  { key: 'sar', nameEn: 'Saudi Riyal', nameFa: 'ریال سعودی', symbol: 'SAR', flag: '🇸🇦', category: 'currency' },
  { key: 'kwd', nameEn: 'Kuwaiti Dinar', nameFa: 'دینار کویت', symbol: 'KWD', flag: '🇰🇼', category: 'currency' },
  { key: 'bhd', nameEn: 'Bahraini Dinar', nameFa: 'دینار بحرین', symbol: 'BHD', flag: '🇧🇭', category: 'currency' },
  { key: 'qar', nameEn: 'Qatari Riyal', nameFa: 'ریال قطر', symbol: 'QAR', flag: '🇶🇦', category: 'currency' },
  { key: 'omr', nameEn: 'Omani Rial', nameFa: 'ریال عمان', symbol: 'OMR', flag: '🇴🇲', category: 'currency' },
  { key: 'iqd', nameEn: 'Iraqi Dinar', nameFa: 'دینار عراق', symbol: 'IQD', flag: '🇮🇶', category: 'currency' },
  { key: 'try', nameEn: 'Turkish Lira', nameFa: 'لیر ترکیه', symbol: 'TRY', flag: '🇹🇷', category: 'currency' },

  // Other Currencies
  { key: 'inr', nameEn: 'Indian Rupee', nameFa: 'روپیه هند', symbol: 'INR', flag: '🇮🇳', category: 'currency' },
  { key: 'rub', nameEn: 'Russian Ruble', nameFa: 'روبل روسیه', symbol: 'RUB', flag: '🇷🇺', category: 'currency' },
  { key: 'azn', nameEn: 'Azerbaijani Manat', nameFa: 'منات آذربایجان', symbol: 'AZN', flag: '🇦🇿', category: 'currency' },
  { key: 'afn', nameEn: 'Afghan Afghani', nameFa: 'افغانی افغانستان', symbol: 'AFN', flag: '🇦🇫', category: 'currency' },
  { key: 'amd', nameEn: 'Armenian Dram', nameFa: 'درام ارمنستان', symbol: 'AMD', flag: '🇦🇲', category: 'currency' },
  { key: 'dkk', nameEn: 'Danish Krone', nameFa: 'کرون دانمارک', symbol: 'DKK', flag: '🇩🇰', category: 'currency' },
  { key: 'hkd', nameEn: 'Hong Kong Dollar', nameFa: 'دلار هنگ کنگ', symbol: 'HKD', flag: '🇭🇰', category: 'currency' },
  { key: 'myr', nameEn: 'Malaysian Ringgit', nameFa: 'رینگیت مالزی', symbol: 'MYR', flag: '🇲🇾', category: 'currency' },
  { key: 'nok', nameEn: 'Norwegian Krone', nameFa: 'کرون نروژ', symbol: 'NOK', flag: '🇳🇴', category: 'currency' },
  { key: 'sek', nameEn: 'Swedish Krona', nameFa: 'کرون سوئد', symbol: 'SEK', flag: '🇸🇪', category: 'currency' },
  { key: 'sgd', nameEn: 'Singapore Dollar', nameFa: 'دلار سنگاپور', symbol: 'SGD', flag: '🇸🇬', category: 'currency' },
  { key: 'thb', nameEn: 'Thai Baht', nameFa: 'بات تایلند', symbol: 'THB', flag: '🇹🇭', category: 'currency' },

  // Gold
  { key: 'gold_ounce', nameEn: 'Gold Ounce', nameFa: 'اونس طلا', symbol: 'OZ', category: 'gold' },
  { key: 'gold_gram_18k', nameEn: '18K Gold', nameFa: 'طلای ۱۸ عیار', symbol: 'Gram', category: 'gold' },
  { key: 'gold_mithqal', nameEn: 'Gold Mithqal', nameFa: 'مثقال طلا', symbol: 'Mithqal', category: 'gold' },

  // Coins
  { key: 'coin_azadi', nameEn: 'Azadi Coin', nameFa: 'سکه تمام', symbol: 'Coin', category: 'coin' },
  { key: 'coin_emami', nameEn: 'Emami Coin', nameFa: 'سکه امامی', symbol: 'Coin', category: 'coin' },
  { key: 'coin_half', nameEn: 'Half Coin', nameFa: 'نیم سکه', symbol: 'Coin', category: 'coin' },
  { key: 'coin_quarter', nameEn: 'Quarter Coin', nameFa: 'ربع سکه', symbol: 'Coin', category: 'coin' },
  { key: 'coin_gram', nameEn: 'Gram Coin', nameFa: 'سکه گرمی', symbol: 'Coin', category: 'coin' },

  // Crypto
  { key: 'bitcoin', nameEn: 'Bitcoin', nameFa: 'بیت کوین', symbol: 'BTC', category: 'crypto' },
];

export const categories = [
  { id: 'all', nameEn: 'All', nameFa: 'همه', icon: '🌐' },
  { id: 'currency', nameEn: 'Currencies', nameFa: 'ارزها', icon: '💵' },
  { id: 'gold', nameEn: 'Gold', nameFa: 'طلا', icon: '🥇' },
  { id: 'coin', nameEn: 'Coins', nameFa: 'سکه', icon: '🪙' },
  { id: 'crypto', nameEn: 'Crypto', nameFa: 'ارز دیجیتال', icon: '₿' },
];
