import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { usersAtom } from '~/atoms/usersAtom';
import type { IFilters } from '~/types/recipe.interface';
import type { IUser } from '~/types/user.interface';
import { usePaginatedQuery, type IPaginationMeta } from './usePaginatedQuery';

const useFetchUsers = (page: number, filters?: IFilters) => {
  const [users, setUsers] = useAtom(usersAtom);
  const [pagination, setPagination] = useState<IPaginationMeta>();

  const { data, isLoading, error, refetch } = usePaginatedQuery<IUser[]>('/users', page, 10, 'users', filters);

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
      setPagination(data.pagination);
    }
  }, [data]);

  return { users, pagination };
};

export default useFetchUsers;
