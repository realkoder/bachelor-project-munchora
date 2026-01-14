// hooks/useApiQuery.ts
import { useQuery } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import { useFetch } from '~/lib/api-client';

export function useApiGetQuery<T>(
  key: QueryKey,
  url: string,
  shouldRefecth = false,
  params?: Record<string, unknown>,
  staleTime = 1000 * 60 * 5 // default: 5 min
) {
  const { fetchData } = useFetch<T>();

  return useQuery({
    queryKey: [key, params],
    queryFn: () => fetchData(url),
    staleTime,
    refetchInterval: shouldRefecth ? 120000 : false,
  });
}
