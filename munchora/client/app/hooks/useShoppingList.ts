import { useAtom } from 'jotai';
import { toast } from 'sonner';
import { shoppingListsAtom } from '~/atoms/shoppingLists';
import { useFetch } from '~/lib/api-client';
import type { IShoppingList, IShoppingListItem, TCategory } from '~/types/shoppingList.interface';
import type { IUser } from '~/types/user.interface';
import { useState } from 'react';

const useShoppingLists = () => {
  const { fetchData } = useFetch<IShoppingList[]>();
  const { fetchData: fetchShoppingList } = useFetch<IShoppingList>();
  const { fetchData: fetchShoppingListItem } = useFetch<IShoppingListItem>();
  const [shoppingLists, setShoppingLists] = useAtom(shoppingListsAtom);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const updateListName = async (listId: number, name: string) => {
    if (!name.trim() || name.length > 50) return;

    try {
      await fetchShoppingList(`/shopping-lists-app/api/v1/shopping_lists/${listId}`, { method: 'PUT', data: { shopping_list: { name } } });
    } catch {
      toast.error('Something went wrong updating the name of your list - check your connection, try reload!');
    }
  };

  const addItemToList = async (listId: number | undefined, name: string, category?: TCategory) => {
    if (!listId || !name.trim() || name.length > 50) return;
    setIsAddingItem(true);
    try {
      await fetchShoppingListItem(`/shopping-lists-app/api/v1/shopping_lists/${listId}/add-item`, {
        method: 'POST',
        data: { item: { name, category } },
      });
    } catch {
      toast.error('Something went wrong adding another item - check your connection, try reload!');
    }
    setIsAddingItem(false);
  };

  const createNewList = async (newListName: string) => {
    if (!newListName.trim() || newListName.length > 50) return;

    try {
      const response = await fetchShoppingList('/shopping-lists-app/api/v1/shopping_lists/', {
        method: 'POST',
        data: { shopping_list: { name: newListName } },
      });
      setShoppingLists((cur) => {
        if (!cur) return undefined;
        return [...cur, response];
      });
    } catch {
      toast.error('Something went wrong creating your new list - check your connection, try reload!');
    }
  };

  const deleteShoppingList = async (listId: number) => {
    try {
      await fetchData(`/shopping-lists-app/api/v1/shopping_lists/${listId}`, { method: 'DELETE' });
    } catch {
      toast.error('Something went wrong deleting list. Check your connection.');
    }
  };

  const deleteShoppingListItem = async (listId: number | undefined, itemId: number) => {
    if (!listId) return;
    try {
      await fetchShoppingList(`/shopping-lists-app/api/v1/shopping_lists/${listId}/remove-item/${itemId}`, { method: 'DELETE' });
    } catch {
      toast.error('Something went wrong removing your item - try to reload');
    }
  };

  const shareList = async (listId: number, selectedUsers: IUser[]) => {
    try {
      const userIds = selectedUsers.map((user) => user.id);
      await fetchShoppingList(`/shopping-lists-app/api/v1/shopping_lists/${listId}/share`, { method: 'POST', data: { user_ids: userIds } });
      toast.info(`You succesfully shared your list with ${selectedUsers.length} other users.`);
    } catch {
      toast.error('Something went wrong sharing your list - try to reload');
    }
  };

  const unShareList = async (listId: number, selectedUserId: number) => {
    try {
      await fetchShoppingList(`/shopping-lists-app/api/v1/shopping_lists/${listId}/unshare`, {
        method: 'DELETE',
        data: { user_id: selectedUserId },
      });
      toast.info(`You succesfully unshared you list with one user.`);
    } catch {
      toast.error('Something went wrong sharing your list - try to reload.');
    }
  };

  const toggleItemCompleted = async (listId: number | undefined, itemId: number, is_completed: boolean) => {
    if (!listId) return;
    try {
      await fetchShoppingList(`/shopping-lists-app/api/v1/shopping_lists/${listId}/update-item/${itemId}`, {
        method: 'PATCH',
        data: { is_completed: !is_completed },
      });
    } catch {
      toast.error('Something went wrong updating your item - try to reload');
    }
  };

  const updateItem = async (listId: number, itemId: number, name: string, category: TCategory) => {
    try {
      await fetchShoppingList(`/shopping-lists-app/api/v1/shopping_lists/${listId}/update-item/${itemId}`, {
        method: 'PATCH',
        data: { name, category },
      });
    } catch {
      toast.error('Something went wrong updating your item - try to reload');
    }
  };

  return {
    updateListName,
    addItemToList,
    createNewList,
    deleteShoppingList,
    deleteShoppingListItem,
    shoppingLists,
    shareList,
    toggleItemCompleted,
    unShareList,
    updateItem,
    isAddingItem,
  };
};

export default useShoppingLists;
