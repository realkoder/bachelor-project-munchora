// hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import { Consumer, createConsumer } from '@rails/actioncable';
import useGroceryListsEvents from './useGrocerylistEvents';

const WEBSOCKET_URL = process.env.NODE_ENV === 'development' ? 'ws://localhost:3000/cable/notify' : 'wss://munchora.pro/cable/notify';

export enum NotificationType {
  GROCERY_LIST_NAME_UPDATED = 'grocery_list_shared_name_updated',
  GROCERY_LIST_SHARED = 'grocery_list_shared',
  GROCERY_LIST_UNSHARED = 'grocery_list_unshared',
  GROCERY_LIST_DELETED = 'grocery_list_deleted',
  GROCERY_ITEM_ADDED = 'grocery_item_added',
  GROCERY_ITEM_REMOVED = 'grocery_item_removed',
  GROCERY_ITEM_UPDATED = 'grocery_item_updated',
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
    handleGroceryListDeleted,
    handleGroceryListItemDeleted,
    handleListShared,
    handleListUnshared,
    handleItemUpdated,
  } = useGroceryListsEvents();

  useEffect(() => {
    if (cable) return;
    const newCable = createConsumer(WEBSOCKET_URL);

    const subscription = newCable.subscriptions.create(
      { channel: 'NotificationsChannel' },
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
      case NotificationType.GROCERY_LIST_NAME_UPDATED:
        handleListNameUpdated(data.payload.grocery_list_id, data.payload.updated_name);
        break;
      case NotificationType.GROCERY_LIST_SHARED:
        handleListShared(data.payload.grocery_list);
        break;
      case NotificationType.GROCERY_LIST_UNSHARED:
        handleListUnshared(data.payload.grocery_list_id, data.payload.kicked_user_id);
        break;
      case NotificationType.GROCERY_LIST_DELETED:
        handleGroceryListDeleted(data.payload.grocery_list_id);
        break;
      case NotificationType.GROCERY_ITEM_ADDED:
        handleItemAddedToList(data.payload.grocery_list_id, data.payload.item);
        break;
      case NotificationType.GROCERY_ITEM_REMOVED:
        handleGroceryListItemDeleted(data.payload.grocery_list_id, data.payload.removed_item_id);
        break;
      case NotificationType.GROCERY_ITEM_UPDATED:
        handleItemUpdated(data.payload.grocery_list_id, data.payload.item);
        break;
      default:
        break;
    }
  };
};

export default useNotifications;
