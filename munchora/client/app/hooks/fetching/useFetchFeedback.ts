import { useEffect, useState } from 'react';
import { usePaginatedQuery, type IPaginationMeta } from './usePaginatedQuery';
import type { IFeedback } from '~/types/feedback.interface';

const useFetchFeedback = (page: number) => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>();
  const [pagination, setPagination] = useState<IPaginationMeta>();
  const { data, isLoading, error, refetch } = usePaginatedQuery<IFeedback[]>('/feedbacks', page, 10, 'feedback');

  useEffect(() => {
    if (data?.data) {
      setFeedbacks(data.data);
      setPagination(data.pagination);
    }
  }, [data]);

  return { feedbacks, isLoading, pagination };
};

export default useFetchFeedback;
