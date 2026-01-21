import { Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { ShoppingList } from '~/components/shopping-lists/shopping-list';
import { NewShoppingList } from '~/components/shopping-lists/new-shopping-list';
import ShareShoppingListModal from '~/components/shopping-lists/share-shopping-list-modal';
import { Button } from '~/components/ui/button';
import useShoppingLists from '~/hooks/useShoppingList';
import type { IShoppingList } from '~/types/shoppingList.interface';
import type { Route } from './+types/shopping-lists';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Shopping Lists' }, { name: 'description', content: 'Welcome to Munchora!' }];
}

export default function ShoppingListsPage() {
  const { createNewList, shoppingLists } = useShoppingLists();
  const [showShareModal, setShowShareModal] = useState(false);
  const [listToShare, setListToShare] = useState<IShoppingList | null>(null);

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setListToShare(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NewShoppingList />

      <div className="grid lg:grid-cols-2 gap-6">
        {shoppingLists
          ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .map((list) => (
            <ShoppingList key={list.id} list={list} setListToShare={setListToShare} setShowShareModal={setShowShareModal}></ShoppingList>
          ))}
      </div>

      {shoppingLists?.length === 0 && (
        <div className="text-center py-16">
          <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No shopping lists yet</h3>
          <p className="text-gray-600 mb-6">Create your first shopping list to get started</p>
          <Button onClick={() => createNewList('Shopping 🛒')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First List
          </Button>
        </div>
      )}

      <ShareShoppingListModal isOpen={showShareModal} closeModel={() => setShowShareModal(false)} onClose={handleCloseShareModal} shoppingList={listToShare} />
    </div>
  );
}
