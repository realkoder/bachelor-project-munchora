import { DialogDescription } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import useRecipes from "~/hooks/useRecipes";

interface DeleteRecipeDialogProps {
  recipeId: string;
}

export const DeleteRecipeDialog = ({ recipeId }: DeleteRecipeDialogProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteRecipe } = useRecipes();

  return (
    <>
      <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal} aria-describedby={undefined}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this recipe?
            <br /> This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteRecipe(recipeId);
                setShowDeleteModal(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
