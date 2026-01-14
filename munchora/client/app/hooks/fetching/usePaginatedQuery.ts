import { useQuery } from '@tanstack/react-query';
import { useFetch } from '~/lib/api-client';

export interface IPaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface IPaginatedResponse<T> {
  data: T;
  pagination: IPaginationMeta;
}

export function usePaginatedQuery<T>(endpoint: string, page: number, perPage = 10, queryKey?: string, params?: Record<string, any>) {
  const { fetchData } = useFetch<IPaginatedResponse<T>>();

  return useQuery({
    queryKey: [queryKey || endpoint, page, params],
    queryFn: () =>
      fetchData(endpoint, {
        method: 'GET',
        params: {
          page,
          per_page: perPage,
          ...params
        },
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
