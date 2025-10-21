import { Pagination } from './common';

export interface AuctionListing {
  id: number;
  itemId: number;
  itemName: string;
  buyout: number;
  quantity: number;
  timeLeft: string; // e.g., "SHORT","MEDIUM","LONG"
  realm: string;
  lastUpdated: string; // ISO
}

export interface AuctionListingsRequest {
  realmId: number;
  page?: number;
  sort?: string; // field:dir
  query?: string;
}

export interface AuctionListingsResponse extends Pagination {
  listings: AuctionListing[];
}

export interface AuctionMetricsResponse {
  totalListings: number;
  uniqueItems: number;
  volume24h: number;
  avgPrice: number;
}