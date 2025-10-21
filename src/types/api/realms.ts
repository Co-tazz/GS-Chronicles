import { RegionCode } from './common';

export interface Realm {
  id: number;
  name: string;
  slug: string;
  region: RegionCode;
  connectedRealmId?: number;
}

export interface RealmsResponse {
  realms: Realm[];
}

export interface ConnectedRealm {
  id: number;
  realmIds: number[];
}

export interface ConnectedRealmsResponse {
  connectedRealms: ConnectedRealm[];
}

export interface RealmSuggestItem {
  id: number;
  name: string;
  slug: string;
}

export interface RealmSuggestResponse {
  suggestions: RealmSuggestItem[];
}