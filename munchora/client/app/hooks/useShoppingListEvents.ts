import { useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'sonner';
import { curUserAtom } from '~/atoms/curUserAtom';
import { shoppingListsAtom } from '~/atoms/shoppingLists';
import type { IShoppingList, IShoppingListItem } from '~/types/shoppingList.interface';

const useShoppingListsEvents = () => {
  const setShoppingLists = useSetAtom(shoppingListsAtom);
  const curUser = useAtomValue(curUserAtom);

  const handleListNameUpdated = (listId: number, updatedName: string) => {
    setShoppingLists((cur) => {
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

  const handleItemAddedToList = (listId: number, addedItem: IShoppingListItem) => {
    setShoppingLists((cur) => {
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

  const handleShoppingListDeleted = (listId: number) => {
    setShoppingLists((cur) => {
      if (!cur) return undefined;
      return cur.filter((list) => list.id !== listId);
    });
  };

  const handleShoppingListItemDeleted = async (listId: number, itemId: number) => {
    setShoppingLists((cur) => {
      if (!cur) return undefined;
      return cur.map((list) => (list.id === listId ? { ...list, items: list.items.filter((item) => item.id != itemId) } : list));
    });
  };

  const handleListShared = async (shoppingList: IShoppingList) => {
    setShoppingLists((cur) => {
      if (!cur) return undefined;
      return [...cur.filter((list) => list.id !== shoppingList.id), shoppingList];
    });
  };

  const handleListUnshared = async (listId: number, kickedUserId: number) => {
    if (kickedUserId === curUser?.user?.id) {
      setShoppingLists((cur) => cur?.filter((list) => list.id !== listId));
      toast.info('You got kicked from a shared list');
    } else {
      setShoppingLists((cur) => {
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

  const handleItemUpdated = (listId: number, updatedItem: IShoppingListItem) => {
    setShoppingLists((cur) => {
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
    handleShoppingListDeleted,
    handleShoppingListItemDeleted,
    handleListShared,
    handleListUnshared,
    handleItemUpdated,
  };
};

export default useShoppingListsEvents;
