export interface Rating {
  average: number;
  count: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface SortOption<TKey extends string = string> {
  key: TKey;
  label: string;
  default?: boolean;
}
