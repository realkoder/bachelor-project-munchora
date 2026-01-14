import { useState } from 'react';
import { ShoppingCart, Plus, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';
import useGroceryLists from '~/hooks/useGrocerylist';
import { toast } from 'sonner';
import type { IIngredient } from '~/types/recipe.interface';

interface IngredientSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: IIngredient;
}

export default function IngredientSelectorModal({ isOpen, onClose, ingredient }: IngredientSelectorModalProps) {
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [addedToLists, setAddedToLists] = useState<string[]>([]);
  const { groceryLists, addItemToList, createNewList } = useGroceryLists();

  const handleAddToList = async (listId: string) => {
    if (!ingredient) return;

    setAddedToLists([...addedToLists, listId]);

    await addItemToList(listId, ingredient.name, ingredient.category);
    toast.info('Successfully added ingredient to your list');
  };

  const handleCreateNewList = async () => {
    if (!newListName.trim()) return;

    setIsCreatingList(true);

    await createNewList(newListName);
    setNewListName('');
    setIsCreatingList(false);
    toast.info('Successfully created a new list');
  };

  const handleClose = () => {
    onClose();
    setAddedToLists([]);
    setNewListName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <ShoppingCart className="h-5 w-5 text-final" />
            <span>Add to Grocery List</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Ingredient */}
          <div className="bg-secondary/50 p-3 sm:p-4 rounded-lg border border-border">
            <DialogDescription className="text-xs sm:text-sm text-fourth mb-1">Selected ingredient:</DialogDescription>
            <DialogDescription>{ingredient?.name}</DialogDescription>
          </div>

          {/* Existing Lists */}
          <div className="space-y-3">
            <DialogTitle className="text-sm font-medium text-slate-700">Choose a list:</DialogTitle>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {groceryLists?.map((list) => (
                <Card
                  key={list.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 ${
                    addedToLists.includes(list.id) ? 'bg-emerald-50 border-emerald-200' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => !addedToLists.includes(list.id) && handleAddToList(list.id)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-slate-800 text-sm sm:text-base truncate">{list.name}</h4>
                          {list.shared_users && (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              Shared
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-slate-500">
                          <span>{list.items.length} items</span>
                          {list.shared_users && <span className="truncate">with {list.shared_users.map((sharedUser) => sharedUser.first_name).join(', ')}</span>}
                        </div>
                      </div>

                      <div className="ml-3 flex-shrink-0">
                        {addedToLists.includes(list.id) ? (
                          <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="bg-secondary/50 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary hover:text-final transition-colors">
                            <Plus className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Create New List */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Or create a new list:</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                placeholder="New list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleCreateNewList()}
                className="flex-1 text-sm sm:text-base"
              />
              <Button onClick={handleCreateNewList} disabled={!newListName.trim() || isCreatingList} size="sm">
                {isCreatingList ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Create</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            {addedToLists.length > 0 && (
              <Button onClick={handleClose} className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto" size="sm">
                <Check className="h-4 w-4 mr-2" />
                Done ({addedToLists.length} added)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
