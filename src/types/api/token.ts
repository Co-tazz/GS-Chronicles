import { PricePoint, RegionCode, TimeWindow } from './common';

export interface TokenCurrentResponse {
  region: RegionCode;
  price: number;
  change24h: number;
  lastUpdated: string;
}

export interface TokenHistoryResponse {
  region: RegionCode;
  window: TimeWindow;
  points: PricePoint[];
}