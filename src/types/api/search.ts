export interface SearchResultItem {
  itemId: number;
  itemName: string;
  quality: string;
  icon?: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
}