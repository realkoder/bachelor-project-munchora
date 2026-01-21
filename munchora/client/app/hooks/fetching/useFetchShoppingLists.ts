import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { shoppingListsAtom } from '~/atoms/shoppingLists';
import type { IShoppingList } from '~/types/shoppingList.interface';
import { useApiGetQuery } from './useApiGetQuery';

const useFetchShoppingLists = () => {
  const { data, isLoading } = useApiGetQuery<IShoppingList[]>(['shoppingLists'], '/shopping-lists/api/v1/shopping_lists', true);
  const setShoppingLists = useSetAtom(shoppingListsAtom);

  useEffect(() => {
    if (data) {
      setShoppingLists(data);
    }
  }, [data]);

  return { isLoading };
};

export default useFetchShoppingLists;
