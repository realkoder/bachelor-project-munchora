import {useEffect, useState} from 'react';
import {Consumer, createConsumer} from '@rails/actioncable';
import useShoppingListsEvents from './useShoppingListEvents';
import useRecipeEvents from "~/hooks/useRecipeEvents";

const WEBSOCKET_URL = process.env.NODE_ENV === 'development' ? 'ws://localhost:3000/notifications/cable' : 'wss://munchora.pro/notifications/cable';

export enum NotificationType {
  RECIPE_CREATED = 'recipe_created',
  SHOPPING_LIST_NAME_UPDATED = 'shopping_list_shared_name_updated',
  SHOPPING_LIST_SHARED = 'shopping_list_shared',
  SHOPPING_LIST_UNSHARED = 'shopping_list_unshared',
  SHOPPING_LIST_DELETED = 'shopping_list_deleted',
  SHOPPING_ITEM_ADDED = 'shopping_item_added',
  SHOPPING_ITEM_REMOVED = 'shopping_item_removed',
  SHOPPING_ITEM_UPDATED = 'shopping_item_updated',
}

interface INotifyEvent {
  type: NotificationType;
  payload: any;
}

const useNotifications = () => {
  const [cable, setCable] = useState<Consumer>();
  const {
    handleListNameUpdated,
    handleItemAddedToList,
    handleShoppingListDeleted,
    handleShoppingListItemDeleted,
    handleListShared,
    handleListUnshared,
    handleItemUpdated,
  } = useShoppingListsEvents();
  const {handleRecipeCreated} = useRecipeEvents();

  useEffect(() => {
    if (cable) return;
    const newCable = createConsumer(WEBSOCKET_URL);

    const subscription = newCable.subscriptions.create(
      {channel: 'NotificationsChannel'},
      {
        received: (data) => {
          handleNotifyEvent(data);
        },
      }
    );

    setCable(newCable);

    return () => {
      subscription.unsubscribe();
      newCable.disconnect();
    };
  }, []);

  const handleNotifyEvent = (data: INotifyEvent) => {
    switch (data.type) {
      case NotificationType.RECIPE_CREATED:
        handleRecipeCreated(data.payload.recipe);
        break;
      case NotificationType.SHOPPING_LIST_NAME_UPDATED:
        handleListNameUpdated(data.payload.shopping_list_id, data.payload.updated_name);
        break;
      case NotificationType.SHOPPING_LIST_SHARED:
        handleListShared(data.payload.shopping_list);
        break;
      case NotificationType.SHOPPING_LIST_UNSHARED:
        handleListUnshared(data.payload.shopping_list_id, data.payload.kicked_user_id);
        break;
      case NotificationType.SHOPPING_LIST_DELETED:
        handleShoppingListDeleted(data.payload.shopping_list_id);
        break;
      case NotificationType.SHOPPING_ITEM_ADDED:
        handleItemAddedToList(data.payload.shopping_list_id, data.payload.item);
        break;
      case NotificationType.SHOPPING_ITEM_REMOVED:
        handleShoppingListItemDeleted(data.payload.shopping_list_id, data.payload.removed_item_id);
        break;
      case NotificationType.SHOPPING_ITEM_UPDATED:
        handleItemUpdated(data.payload.shopping_list_id, data.payload.item);
        break;
      default:
        break;
    }
  };
};

export default useNotifications;
