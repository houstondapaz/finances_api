export type PaginatedResource<T> = {
  total: number;
  items: T[];
  pageSize: number;
  totalPages: number;
  page: number;
};
