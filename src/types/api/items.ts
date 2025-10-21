import { Pagination, PricePoint, TimeWindow } from './common';

export interface ItemSummary {
  id: number;
  name: string;
  quality: string; // e.g., "common","rare","epic"
  minPrice: number;
  avgPrice: number;
  medianPrice: number;
  volume: number;
  change24h: number; // percentage
  icon?: string;
}

export interface ItemsQueryRequest {
  realmId: number;
  query?: string;
  sort?: string; // field:dir
  page?: number;
}

export interface ItemsQueryResponse extends Pagination {
  items: ItemSummary[];
}

export interface ItemDetail {
  id: number;
  name: string;
  quality: string;
  icon?: string;
  description?: string;
  minPrice: number;
  avgPrice: number;
  medianPrice: number;
  volume: number;
  change24h: number;
  lastUpdated: string;
}

export interface ItemDetailResponse {
  item: ItemDetail;
}

export interface ItemPriceHistoryRequest {
  realmId: number;
  window: TimeWindow;
}

export interface ItemPriceHistoryResponse {
  points: PricePoint[];
}