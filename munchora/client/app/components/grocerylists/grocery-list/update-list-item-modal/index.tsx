import { DialogDescription } from '@radix-ui/react-dialog';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { CATEGORIES, type TCategory } from '~/types/groceryList.interface';

interface UpdateListItemProps {
  isEditModalVisible: boolean;
  setEditModalVisible: (val: boolean) => void;
  editedName: string;
  setEditedName: (val: string) => void;
  editedCategory: TCategory;
  setEditedCategory: (val: TCategory) => void;
  handleUpdate: () => void;
}

export const UpdateListItemModal = ({
  isEditModalVisible,
  setEditModalVisible,
  editedName,
  setEditedName,
  editedCategory,
  setEditedCategory,
  handleUpdate,
}: UpdateListItemProps) => {
  return (
    <Dialog open={isEditModalVisible} onOpenChange={setEditModalVisible}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>

        <DialogDescription className="space-y-4">
          <Input placeholder="Name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />

          <Select value={editedCategory} onValueChange={(val: TCategory) => setEditedCategory(val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {/* Capitalize for display */}
                  {category.replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogDescription>

        <DialogFooter className="mt-4 gap-2 sm:gap-4">
          <Button variant="outline" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
