export type RecommendationSignal = 'buy' | 'sell' | 'watch';

export interface Recommendation {
  id: string;
  itemId: number;
  itemName: string;
  signal: RecommendationSignal;
  confidence: number; // 0..1
  rationale?: string;
  targetPrice?: number;
  realmId: number;
  lastUpdated: string;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export interface RecommendationsRefreshResponse {
  status: 'queued' | 'running' | 'done' | 'error';
  jobId?: string;
  message?: string;
}