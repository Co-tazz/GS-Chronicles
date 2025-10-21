export type RealmId = number;
export type RegionCode = 'US' | 'EU' | 'KR' | 'TW' | 'CN' | string;

export type TimeWindow = '24h' | '7d' | '30d' | '90d';

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

export interface PricePoint {
  timestamp: string; // ISO string
  price: number;
}

export interface ApiResponse<T> {
  data: T;
}