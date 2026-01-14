import { useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'sonner';
import { curUserAtom } from '~/atoms/curUserAtom';
import { groceryListsAtom } from '~/atoms/groceryLists';
import type { IGroceryList, IGroceryListItem } from '~/types/groceryList.interface';

const useGroceryListsEvents = () => {
  const setGroceryLists = useSetAtom(groceryListsAtom);
  const curUser = useAtomValue(curUserAtom);

  const handleListNameUpdated = (listId: number, updatedName: string) => {
    setGroceryLists((cur) => {
      if (!cur) return undefined;
      return cur.map((list) => {
        if (list.id === listId) {
          return { ...list, name: updatedName };
        } else {
          return list;
        }
      });
    });
  };

  const handleItemAddedToList = (listId: number, addedItem: IGroceryListItem) => {
    setGroceryLists((cur) => {
      if (!cur) return undefined;
      return cur.map((list) => {
        if (list.id === listId) {
          return { ...list, items: [...list.items, addedItem] };
        } else {
          return list;
        }
      });
    });
  };

  const handleGroceryListDeleted = (listId: number) => {
    setGroceryLists((cur) => {
      if (!cur) return undefined;
      return cur.filter((list) => list.id !== listId);
    });
  };

  const handleGroceryListItemDeleted = async (listId: number, itemId: number) => {
    setGroceryLists((cur) => {
      if (!cur) return undefined;
      return cur.map((list) => (list.id === listId ? { ...list, items: list.items.filter((item) => item.id != itemId) } : list));
    });
  };

  const handleListShared = async (groceryList: IGroceryList) => {
    setGroceryLists((cur) => {
      if (!cur) return undefined;
      return [...cur.filter((list) => list.id !== groceryList.id), groceryList];
    });
  };

  const handleListUnshared = async (listId: number, kickedUserId: string) => {
    if (kickedUserId === curUser?.user?.id) {
      setGroceryLists((cur) => cur?.filter((list) => list.id !== listId));
      toast.info('You got kicked from a shared list');
    } else {
      setGroceryLists((cur) => {
        if (!cur) return undefined;
        return cur.map((list) => {
          if (list.id === listId) {
            list.shared_users = list.shared_users.filter((sharedUser) => sharedUser.id !== kickedUserId);
            return list;
          }
          return list;
        });
      });
    }
  };

  const handleItemUpdated = (listId: number, updatedItem: IGroceryListItem) => {
    setGroceryLists((cur) => {
      if (!cur) return cur;

      return cur.map((list) => {
        if (list.id === listId) {
          const updatedItems = list.items.map((item) =>
            item.id === updatedItem.id
              ? { ...item, is_completed: updatedItem.is_completed, name: updatedItem.name, category: updatedItem.category, updated_at: updatedItem.updated_at }
              : item
          );

          return {
            ...list,
            items: updatedItems,
          };
        }
        return list;
      });
    });
  };

  return {
    handleListNameUpdated,
    handleItemAddedToList,
    handleGroceryListDeleted,
    handleGroceryListItemDeleted,
    handleListShared,
    handleListUnshared,
    handleItemUpdated,
  };
};

export default useGroceryListsEvents;
