import { Button } from '~/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Edit2, Pencil, Plus, Trash2, User, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useNavigate, useParams } from 'react-router';
import { CATEGORIES, type TCategory } from '~/types/groceryList.interface';
import { curGroceryListAtom } from '~/atoms/curGroceryList';
import useGroceryLists from '~/hooks/useGrocerylist';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { DeleteListItem } from '~/components/grocerylists/grocery-list/delete-list-item';
import { UpdateListItemModal } from '~/components/grocerylists/grocery-list/update-list-item-modal';
import { Checkbox } from '~/components/ui/checkbox';

export function meta() {
  [
    { title: 'Shopping List | Munchora' },
    {
      name: 'Shopping List | Munchora',
      content: 'Discover delicious recipes on Munchora!',
    },
  ];
}

export default function GroceryListDetail() {
  const params = useParams();
  const listId = params.listId;
  const [curGroceryList, setCurGroceryList] = useAtom(curGroceryListAtom);
  const { addItemToList, deleteGroceryList, deleteGroceryListItem, groceryLists, toggleItemCompleted, isAddingItem, updateItem } = useGroceryLists();
  const [isEditing, setIsEditing] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<TCategory>('no category 📦');
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedCategory, setEditedCategory] = useState<TCategory>('no category 📦');
  const [editItemId, setEditItemId] = useState<number>(0);

  useEffect(() => {
    if (listId && groceryLists && groceryLists.length > 0) {
      const selectedList = groceryLists.find((list) => list.id === listId);
      setCurGroceryList(selectedList);
    }
  }, [groceryLists]);

  const openModal = (itemName: string, itemCategory: TCategory) => {
    setEditedName(itemName);
    setEditedCategory(itemCategory);
    setEditModalVisible(true);
  };

  const handleUpdate = () => {
    if (!listId) return;
    updateItem(listId, editItemId, editedName, editedCategory);
    setEditModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/grocery-lists')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lists
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4 max-w-md">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="text-2xl font-bold" placeholder="List name" />
                  <div className="flex space-x-2">
                    <Button onClick={() => console.log('IMPLEMENT ME')} size="sm">
                      Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{curGroceryList?.name}</h1>
                    <Badge
                      variant={curGroceryList && curGroceryList.shared_users.length > 0 ? 'default' : 'secondary'}
                      className={curGroceryList && curGroceryList.shared_users.length > 0 ? 'bg-blue-500' : ''}
                    >
                      {curGroceryList && curGroceryList.shared_users.length > 0 ? (
                        <>
                          <Users className="w-3 h-3 mr-1" /> Shared
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 mr-1" /> Personal
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {curGroceryList?.created_at && new Date(curGroceryList?.created_at).toDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Add New Item */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Add New Item</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div>
                <Input
                  placeholder="Add item..."
                  disabled={isAddingItem}
                  onChange={(e) => {
                    setNewItemName(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      addItemToList(listId, newItemName, newItemCategory);
                      setNewItemName('');
                    }
                  }}
                />
              </div>
              <div>
                <Select value={newItemCategory} onValueChange={(val: TCategory) => setNewItemCategory(val)}>
                  <SelectTrigger>
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
              </div>
              <div className="flex items-end">
                <Button onClick={() => addItemToList(listId, newItemName, newItemCategory)} className="w-full">
                  Add Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items by Category */}
        <div className="space-y-4">
          {CATEGORIES.filter((category) => curGroceryList?.items.some((item) => item.category === category)).map((category) => (
            <Card key={category as string}>
              <CardHeader>
                <CardTitle className="text-lg text-left">{category as string}</CardTitle>
                <CardDescription className="text-left">
                  {curGroceryList?.items.filter((item) => item.category === category && item.is_completed).length} of{' '}
                  {curGroceryList?.items.filter((item) => item.category === category).length} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {curGroceryList?.items
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div key={item.id} className="flex items-center p-2 rounded-lg border hover:bg-secondary/25">
                        <Checkbox checked={item.is_completed} onCheckedChange={() => toggleItemCompleted(listId, item.id, item.is_completed)} />
                        <span
                          className={`flex-1 text-left break-all mx-2 ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                          onClick={() => toggleItemCompleted(listId, item.id, item.is_completed)}
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
                          className="rounded-full p-1 pr-4 hover:bg-third/80"
                        >
                          <Pencil className="text-third" />
                        </Button>

                        <DeleteListItem item={item} handleDeleteItem={() => deleteGroceryListItem(listId, item.id)} />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Uncategorized items */}
          {curGroceryList && curGroceryList.items.filter((item) => !item.category).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {curGroceryList.items
                    .filter((item) => !item.category)
                    .map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <Checkbox checked={item.is_completed} onCheckedChange={() => toggleItemCompleted(listId, item.id, item.is_completed)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${item.is_completed ? 'line-through text-muted-foreground' : ''}`}>{item.name}</span>
                            <div className="flex items-center space-x-2">
                              {/* {item.estimatedPrice > 0 && (
                                <span className={`text-sm font-medium ${item.completed ? 'text-green-600' : 'text-muted-foreground'}`}>
                                  ${item.estimatedPrice.toFixed(2)}
                                </span>
                              )} */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteGroceryListItem(listId, item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {/* {item.notes && <p className={`text-sm mt-1 text-muted-foreground`}>{item.notes}</p>} */}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {curGroceryList?.items.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Circle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No items yet</h3>
              <p className="text-muted-foreground">Add your first item to get started!</p>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Progress Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Items completed</span>
                  <span>
                    {curGroceryList?.items.filter((item) => item.is_completed).length} of {curGroceryList?.items.length}
                  </span>
                </div>
                {/* Progress */}
                {curGroceryList && curGroceryList?.items.length > 0 && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>
                        {curGroceryList.items.filter((item) => item.is_completed).length} of {curGroceryList.items.length} completed
                      </span>
                    </div>
                    <div className="w-full bg-third rounded-full h-2">
                      <div
                        className="bg-final h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(curGroceryList.items.filter((item) => item.is_completed).length / curGroceryList.items.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{curGroceryList?.items.filter((item) => item.is_completed).length}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {curGroceryList ? curGroceryList.items.length - curGroceryList.items.filter((item) => item.is_completed).length : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <UpdateListItemModal
        isEditModalVisible={isEditModalVisible}
        setEditModalVisible={setEditModalVisible}
        editedName={editedName}
        setEditedName={setEditedName}
        editedCategory={editedCategory}
        setEditedCategory={setEditedCategory}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
