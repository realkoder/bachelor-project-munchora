import { Eye, Pencil, Plus, Share2, ShoppingCart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import useGroceryLists from '~/hooks/useGrocerylist';
import { CATEGORIES, type IGroceryList, type TCategory } from '~/types/groceryList.interface';
import { DeleteGroceryListDialog } from './delete-grocery-list-dialog';
import { useDebounce } from '~/hooks/fetching/useDebounceSearch';
import { UpdateListItemModal } from './update-list-item-modal';
import { useAtomValue } from 'jotai';
import { curUserAtom } from '~/atoms/curUserAtom';
import { DeleteListItem } from './delete-list-item';
import { LoaderSpinner } from '~/components/loader-spinner';
import { useNavigate } from 'react-router';

interface GroceryListProps {
  list: IGroceryList;
  setListToShare: (list: IGroceryList) => void;
  setShowShareModal: (value: boolean) => void;
}

export const GroceryList = ({ list, setListToShare, setShowShareModal }: GroceryListProps) => {
  const { updateListName, addItemToList, deleteGroceryListItem, toggleItemCompleted, updateItem, isAddingItem } = useGroceryLists();
  const [newItemName, setNewItemName] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newItemCategory, setNewItemCategory] = useState<TCategory>('no category 📦');
  const curUser = useAtomValue(curUserAtom);
  const navigate = useNavigate();

  const [newListName, setNewListName] = useState(list.name ?? undefined);
  const debouncedName = useDebounce(newListName, 1500);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedCategory, setEditedCategory] = useState<TCategory>('no category 📦');
  const [editItemId, setEditItemId] = useState<number>(0);

  useEffect(() => {
    if (!debouncedName || debouncedName === list?.name || debouncedName.length === 0) return;
    updateListName(list.id, debouncedName);
  }, [debouncedName]);

  const handleShareClick = (list: IGroceryList) => {
    setListToShare(list);
    setShowShareModal(true);
  };

  const openModal = (itemName: string, itemCategory: TCategory) => {
    setEditedName(itemName);
    setEditedCategory(itemCategory);
    setEditModalVisible(true);
  };

  const handleUpdate = () => {
    updateItem(list.id, editItemId, editedName, editedCategory);
    setEditModalVisible(false);
  };

  return (
    <Card key={list.id} className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="text-left">
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-third" />
              <Input placeholder="Name Of Shopping List" maxLength={40} value={newListName} onChange={(e) => setNewListName(e.target.value)} />
              {list.shared_users?.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  <Users className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => navigate(`/grocery-list/${list.id}`)}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </CardTitle>
            {list.shared_users?.length > 0 && (
              <CardDescription>Shared with: {list.shared_users.map((user) => user.first_name.split(' ')[0]).join(', ')}</CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => handleShareClick(list)} className="text-third hover:text-third hover:bg-gray-100">
              <Share2 className="h-4 w-4" />
            </Button>
            <DeleteGroceryListDialog isOwner={list.owner_id === curUser?.user?.id} groceryListId={list.id} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add New Item */}
        <div className="flex flex-row items-center space-x-2">
          {/* <div className="flex flex-col gap-2 sm:flex-row"> */}
          <Input
            placeholder="Add item..."
            disabled={isAddingItem}
            maxLength={50}
            value={selectedListId === list.id ? newItemName : ''}
            onChange={(e) => {
              setNewItemName(e.target.value);
              setSelectedListId(list.id);
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                addItemToList(list.id, newItemName, newItemCategory);
                setNewItemName('');
                setSelectedListId(null);
              }
            }}
          />
          <Select value={newItemCategory} onValueChange={(val: TCategory) => setNewItemCategory(val)}>
            <SelectTrigger className="w-[100px] px-1 m:w-[200px]">
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
          {/* </div> */}
          {isAddingItem ? (
            <LoaderSpinner />
          ) : (
            <Button
              cy-data="add-item"
              size="sm"
              disabled={isAddingItem}
              onClick={() => {
                addItemToList(list.id, newItemName, newItemCategory);
                setNewItemName('');
                setSelectedListId(null);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-2 max-h-76 overflow-y-auto">
          {list.items
            .sort((a, b) => {
              if (a.category === b.category) {
                return a.name.localeCompare(b.name);
              }
              return (a?.category || 'no category 📦').localeCompare(b.category || 'no category 📦');
            })
            .map((item) => (
              <div key={item.id} cy-data="list-item" className="flex items-center p-2 border-b border-secondary">
                <Checkbox checked={item.is_completed} onCheckedChange={() => toggleItemCompleted(list.id, item.id, item.is_completed)} />
                <span
                  className={`flex-1 text-left break-all mx-2 ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                  onClick={() => toggleItemCompleted(list.id, item.id, item.is_completed)}
                >
                  {item.name}
                </span>

                <Badge variant="outline" className={`text-xs ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.category ?? 'none'}
                </Badge>

                <Button
                  variant={'ghost'}
                  onClick={() => {
                    setEditItemId(item.id);
                    openModal(item.name, item.category || 'no category 📦');
                  }}
                  className="rounded-full p-1 pr-4 active:bg-gray-100"
                >
                  <Pencil className="text-third" />
                </Button>

                <DeleteListItem item={item} handleDeleteItem={() => deleteGroceryListItem(list.id, item.id)} />
              </div>
            ))}

          {list.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No items yet. Add your first item above!</p>
            </div>
          )}
        </div>

        {/* Progress */}
        {list.items.length > 0 && (
          <div className="">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>
                {list.items.filter((item) => item.is_completed).length} of {list.items.length} completed
              </span>
            </div>
            <div className="w-full bg-third rounded-full h-2">
              <div
                className="bg-final h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(list.items.filter((item) => item.is_completed).length / list.items.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>

      <UpdateListItemModal
        isEditModalVisible={isEditModalVisible}
        setEditModalVisible={setEditModalVisible}
        editedName={editedName}
        setEditedName={setEditedName}
        editedCategory={editedCategory}
        setEditedCategory={setEditedCategory}
        handleUpdate={handleUpdate}
      />
    </Card>
  );
};
