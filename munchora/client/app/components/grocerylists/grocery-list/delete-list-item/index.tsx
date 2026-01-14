import { Check, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { LoaderSpinner } from '~/components/loader-spinner';
import { Button } from '~/components/ui/button';
import type { IGroceryListItem } from '~/types/groceryList.interface';

interface DeleteListItemProps {
  item: IGroceryListItem;
  handleDeleteItem: (id: number) => Promise<void>;
}

export const DeleteListItem: React.FC<DeleteListItemProps> = ({ item, handleDeleteItem }) => {
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const handlePressTrash = (id: number) => {
    setConfirmingId(id);

    setTimeout(() => {
      setConfirmingId((prev) => (prev === id ? null : prev));
    }, 5000);
  };

  const handleConfirmDelete = async (id: number) => {
    setDeletingItemId(id);
    await handleDeleteItem(id);
    setConfirmingId(null);
    setDeletingItemId(null);
  };

  if (deletingItemId === item.id) {
    return <LoaderSpinner />;
  }

  return confirmingId === item.id ? (
    <Button
      cy-data="confirm-delete-item-btn"
      variant={'ghost'}
      size={'sm'}
      onClick={() => handleConfirmDelete(item.id)}
      className="rounded-full bg-final p-2 text-white hover:bg-final/90 transition duration-200"
    >
      <Check className="h-4 w-4" />
    </Button>
  ) : (
    <Button
      cy-data="delete-item-btn"
      variant={'ghost'}
      size={'sm'}
      onClick={() => handlePressTrash(item.id)}
      className="rounded-full p-2 text-third hover:bg-third/80 transition duration-200"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
