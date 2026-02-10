export interface CurrencyData {
  aed: string;
  afn: string;
  amd: string;
  aud: string;
  azn: string;
  bhd: string;
  bitcoin: string;
  cad: string;
  chf: string;
  cny: string;
  coin_azadi: string;
  coin_emami: string;
  coin_gram: string;
  coin_half: string;
  coin_quarter: string;
  dkk: string;
  eur: string;
  gbp: string;
  gold_gram_18k: string;
  gold_mithqal: string;
  gold_ounce: string;
  hkd: string;
  inr: string;
  iqd: string;
  jpy: string;
  kwd: string;
  myr: string;
  nok: string;
  omr: string;
  qar: string;
  rub: string;
  sar: string;
  sek: string;
  sgd: string;
  thb: string;
  try: string;
  usd: string;
}

export interface ApiResponse {
  data: CurrencyData;
  last_updated: string;
  status: string;
}

export interface CurrencyItem {
  key: keyof CurrencyData;
  name: string;
  symbol: string;
  flag?: string;
  category: 'currency' | 'gold' | 'coin' | 'crypto';
}
