import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { groceryListsAtom } from '~/atoms/groceryLists';
import type { IGroceryList } from '~/types/groceryList.interface';
import { useApiGetQuery } from './useApiGetQuery';

const useFetchGroceryLists = () => {
  const { data, isLoading } = useApiGetQuery<IGroceryList[]>(['groceryLists'], '/grocery_lists', true);
  const setGroceryLists = useSetAtom(groceryListsAtom);

  useEffect(() => {
    if (data) {
      setGroceryLists(data);
    }
  }, [data]);

  return { isLoading };
};

export default useFetchGroceryLists;
