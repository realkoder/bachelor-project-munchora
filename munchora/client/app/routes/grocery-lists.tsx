import { Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { GroceryList } from '~/components/grocerylists/grocery-list';
import { NewGroceryList } from '~/components/grocerylists/new-grocery-list';
import ShareGroceryListModal from '~/components/grocerylists/share-grocerylist-modal';
import { Button } from '~/components/ui/button';
import useGroceryLists from '~/hooks/useGrocerylist';
import type { IGroceryList } from '~/types/groceryList.interface';
import type { Route } from './+types/grocery-lists';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Grocery Lists' }, { name: 'description', content: 'Welcome to Munchora!' }];
}

export default function GroceryListsPage() {
  const { createNewList, groceryLists } = useGroceryLists();
  const [showShareModal, setShowShareModal] = useState(false);
  const [listToShare, setListToShare] = useState<IGroceryList | null>(null);

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setListToShare(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NewGroceryList />

      <div className="grid lg:grid-cols-2 gap-6">
        {groceryLists
          ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .map((list) => (
            <GroceryList key={list.id} list={list} setListToShare={setListToShare} setShowShareModal={setShowShareModal}></GroceryList>
          ))}
      </div>

      {groceryLists?.length === 0 && (
        <div className="text-center py-16">
          <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No grocery lists yet</h3>
          <p className="text-gray-600 mb-6">Create your first grocery list to get started</p>
          <Button onClick={() => createNewList('Shopping 🛒')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First List
          </Button>
        </div>
      )}

      <ShareGroceryListModal isOpen={showShareModal} closeModel={() => setShowShareModal(false)} onClose={handleCloseShareModal} groceryList={listToShare} />
    </div>
  );
}
