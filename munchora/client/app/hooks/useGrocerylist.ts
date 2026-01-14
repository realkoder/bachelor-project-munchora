import { useAtom } from 'jotai';
import { toast } from 'sonner';
import { groceryListsAtom } from '~/atoms/groceryLists';
import { useFetch } from '~/lib/api-client';
import type { IGroceryList, IGroceryListItem, TCategory } from '~/types/groceryList.interface';
import type { IUser } from '~/types/user.interface';
import { useState } from 'react';

const useGroceryLists = () => {
  const { fetchData } = useFetch<IGroceryList[]>();
  const { fetchData: fetchGroceryList } = useFetch<IGroceryList>();
  const { fetchData: fetchGroceryListItem } = useFetch<IGroceryListItem>();
  const [groceryLists, setGroceryLists] = useAtom(groceryListsAtom);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const updateListName = async (listId: string, name: string) => {
    if (!name.trim() || name.length > 50) return;

    try {
      await fetchGroceryList(`/grocery_lists/${listId}`, { method: 'PUT', data: { grocery_list: { name } } });
    } catch {
      toast.error('Something went wrong updating the name of your list - check your connection, try reload!');
    }
  };

  const addItemToList = async (listId: string | undefined, name: string, category?: TCategory) => {
    if (!listId || !name.trim() || name.length > 50) return;
    setIsAddingItem(true);
    try {
      await fetchGroceryListItem(`/grocery_lists/${listId}/add-item`, {
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
      const response = await fetchGroceryList('/grocery_lists/', {
        method: 'POST',
        data: { grocery_list: { name: newListName } },
      });
      setGroceryLists((cur) => {
        if (!cur) return undefined;
        return [...cur, response];
      });
    } catch {
      toast.error('Something went wrong creating your new list - check your connection, try reload!');
    }
  };

  const deleteGroceryList = async (listId: string) => {
    try {
      await fetchData(`/grocery_lists/${listId}`, { method: 'DELETE' });
    } catch {
      toast.error('Something went wrong deleting list. Check your connection.');
    }
  };

  const deleteGroceryListItem = async (listId: string | undefined, itemId: number) => {
    if (!listId) return;
    try {
      await fetchGroceryList(`/grocery_lists/${listId}/remove-item/${itemId}`, { method: 'DELETE' });
    } catch {
      toast.error('Something went wrong removing your item - try to reload');
    }
  };

  const shareList = async (listId: string, selectedUsers: IUser[]) => {
    try {
      const userIds = selectedUsers.map((user) => user.id);
      await fetchGroceryList(`/grocery_lists/${listId}/share`, { method: 'POST', data: { user_ids: userIds } });
      toast.info(`You succesfully shared your list with ${selectedUsers.length} other users.`);
    } catch {
      toast.error('Something went wrong sharing your list - try to reload');
    }
  };

  const unShareList = async (listId: string, selectedUserId: string) => {
    try {
      await fetchGroceryList(`/grocery_lists/${listId}/unshare`, {
        method: 'DELETE',
        data: { user_id: selectedUserId },
      });
      toast.info(`You succesfully unshared you list with one user.`);
    } catch {
      toast.error('Something went wrong sharing your list - try to reload.');
    }
  };

  const toggleItemCompleted = async (listId: string | undefined, itemId: number, is_completed: boolean) => {
    if (!listId) return;
    try {
      await fetchGroceryList(`/grocery_lists/${listId}/update-item/${itemId}`, {
        method: 'PATCH',
        data: { is_completed: !is_completed },
      });
    } catch {
      toast.error('Something went wrong updating your item - try to reload');
    }
  };

  const updateItem = async (listId: string, itemId: number, name: string, category: TCategory) => {
    try {
      await fetchGroceryList(`/grocery_lists/${listId}/update-item/${itemId}`, {
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
    deleteGroceryList,
    deleteGroceryListItem,
    groceryLists,
    shareList,
    toggleItemCompleted,
    unShareList,
    updateItem,
    isAddingItem,
  };
};

export default useGroceryLists;
