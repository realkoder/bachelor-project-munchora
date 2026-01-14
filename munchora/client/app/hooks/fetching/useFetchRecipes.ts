import type { IFilters, IRecipe } from '~/types/recipe.interface';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePaginatedQuery, type IPaginationMeta } from './usePaginatedQuery';
import { recipesAtom } from '~/atoms/recipesAtom';

const useFetchRecipes = (page: number, filters?: IFilters) => {
  const setRecipes = useSetAtom(recipesAtom);
  const [pagination, setPagination] = useState<IPaginationMeta>();

  const { data, isLoading, error, refetch } = usePaginatedQuery<{recipes: IRecipe[]}>('/recipes', page, 9, 'recipes', filters);

  useEffect(() => {
    if (data?.data) {
      setRecipes(data.data.recipes);
      setPagination(data.pagination);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch recipes');
    }
  }, [error]);

  return { isLoading, error, pagination };
};

export default useFetchRecipes;
