export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filtersSnapshot: Record<string, unknown>;
  resultCount: number;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  query: string;
  filters: Record<string, unknown>;
  alertsEnabled: boolean;
  createdAt: string;
}
