import { DialogDescription } from '@radix-ui/react-dialog';
import { DoorOpen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import useGroceryLists from '~/hooks/useGrocerylist';

interface DeleteRecipeDialogProps {
  isOwner: boolean;
  groceryListId: string;
}

export const DeleteGroceryListDialog = ({ isOwner, groceryListId }: DeleteRecipeDialogProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteGroceryList } = useGroceryLists();

  return (
    <>
      <Button cy-data="delete-list-btn" variant="destructive" onClick={() => setShowDeleteModal(true)}>
        {isOwner ? <Trash2 className="h-4 w-4" /> : <DoorOpen className="h-4 w-4" />}
      </Button>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal} aria-describedby={undefined}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isOwner ? 'Delete' : 'Leave'} Grocery list?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to {isOwner ? 'delete' : 'leave'} this grocery list?
            <br />
            This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                deleteGroceryList(groceryListId);
                setShowDeleteModal(false);
              }}
            >
              {isOwner ? 'Delete' : 'Leave'}
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
