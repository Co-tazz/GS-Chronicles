export type SnapshotFrequency = '15m' | '30m' | '1h' | '4h';
export type ThemeMode = 'system' | 'light' | 'dark';

export interface UserSettings {
  priceAlertsEnabled: boolean;
  marketInsightsEnabled: boolean;
  snapshotFrequency: SnapshotFrequency;
  autoRefreshCharts: boolean;
  theme: ThemeMode;
}

export interface UserPreferences {
  preferredRealmId?: number;
}

export interface UserSettingsResponse {
  settings: UserSettings;
}

export interface UserPreferencesResponse {
  preferences: UserPreferences;
}

export interface UserProfile {
  id: string;
  email: string;
  preferredRealmId?: number;
}

export interface AuthSession {
  user?: UserProfile;
  isAuthenticated: boolean;
}