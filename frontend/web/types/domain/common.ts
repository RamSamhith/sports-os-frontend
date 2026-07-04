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
