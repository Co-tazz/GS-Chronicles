import { PricePoint } from './common';

export interface TrendingItem {
  itemId: number;
  itemName: string;
  change24h: number;
  avgPrice: number;
  volume: number;
}

export interface DashboardTotals {
  listings: number;
  uniqueItems: number;
  volume24h: number;
  avgPrice: number;
}

export interface DashboardSummaryResponse {
  realmId: number;
  totals: DashboardTotals;
  topMovers: TrendingItem[];
  updatedAt: string;
}

export interface AuctionsTrendingResponse {
  realmId: number;
  items: TrendingItem[];
}

export interface PriceHistorySeries {
  itemId: number;
  points: PricePoint[];
}