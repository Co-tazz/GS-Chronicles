export interface WatchlistItem {
  id: number;
  itemId: number;
  itemName: string;
  quality: string;
  currentPrice: number;
  change24h: number;
  alertCondition: string;
  alertEnabled: boolean;
  status: string; // e.g., "watching","paused"
  realmId: number;
}

export interface WatchlistResponse {
  items: WatchlistItem[];
}

export interface WatchlistItemCreateRequest {
  itemId: number;
  realmId: number;
  alertCondition?: string;
}

export interface WatchlistItemCreateResponse {
  item: WatchlistItem;
}

export interface WatchlistItemUpdateRequest {
  alertEnabled?: boolean;
  alertCondition?: string;
  status?: string;
}

export interface WatchlistItemUpdateResponse {
  item: WatchlistItem;
}