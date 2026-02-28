import { Share2, Search, Users, X, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';

import useFetchUsers from '~/hooks/fetching/useFetchUsers';
import type { IShoppingList } from '~/types/shoppingList.interface';
import { useDebounce } from '~/hooks/fetching/useDebounceSearch';
import { PaginationNavigation } from '~/components/pagination-navigation';
import { useAtomValue } from 'jotai';
import { curUserAtom } from '~/atoms/curUserAtom';
import { toast } from 'sonner';
import useShoppingLists from "~/hooks/useShoppingList";

interface ShareShoppingListModalProps {
  isOpen: boolean;
  closeModel: () => void;
  onClose: () => void;
  shoppingList: IShoppingList | null;
}

export default function ShareShoppingListModal({ isOpen, closeModel, onClose, shoppingList }: ShareShoppingListModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const { shareList, unShareList } = useShoppingLists();
  const curUser = useAtomValue(curUserAtom);
  const [curPage, setCurPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 800);
  const { users, pagination } = useFetchUsers(curPage, { search: debouncedSearch });

  useEffect(() => {
    if (pagination) {
      if (curPage > pagination.total_pages) {
        setCurPage(1);
      }
      if (curPage < 1) {
        setCurPage(1);
      }
    }
  }, [pagination, curPage]);

  const handleUserToggle = (userId: number) => {
    if (userId === curUser?.user?.id || shoppingList?.shared_users.find((sharedUser) => sharedUser.id === userId)) {
      toast.error('Already shared with this user.');
      return;
    }
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleShare = async () => {
    if (!shoppingList || selectedUserIds.length === 0) return;

    setIsSharing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const selectedUsers = selectedUserIds.map((userId) => users?.find((user) => user.id === userId)).filter((user) => user !== undefined);

      shareList(shoppingList.id, selectedUsers);

      setSelectedUserIds([]);
    } catch (error) {
      console.error('Error sharing list:', error);
    } finally {
      setIsSharing(false);
      closeModel();
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUserIds([]);
    setSearchQuery('');
  };

  const getProviderBadge = (provider?: string) => {
    if (!provider) return null;

    const providerColors = {
      google: 'bg-red-100 text-red-700',
      github: 'bg-gray-100 text-gray-700',
      facebook: 'bg-blue-100 text-blue-700',
      twitter: 'bg-sky-100 text-sky-700',
    };

    return (
      <Badge variant="outline" className={`text-xs ${providerColors[provider as keyof typeof providerColors] || 'bg-slate-100 text-slate-700'}`}>
        {provider}
      </Badge>
    );
  };

  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getInitials = (fullname: string) => {
    return fullname
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  };

  if (!shoppingList) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Share2 className="h-5 w-5 text-third" />
            <span>Share: {shoppingList.name}</span>
          </DialogTitle>

          <DialogDescription>Select users to share this shopping list with, or invite someone by email.</DialogDescription>
        </DialogHeader>

        {/* Search Users */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by name, email, or bio..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>

        {/* Selected Users Summary */}
        {selectedUserIds.length > 0 && (
          <div className="p-3 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-final">
                {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUserIds([])} className="text-final hover:text-final/90 h-auto p-1">
                Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedUserIds.map((userId) => {
                const user = users?.find((u) => u.id === userId);
                return user ? (
                  <Badge key={userId} variant="secondary">
                    {user.fullname}
                    <button onClick={() => handleUserToggle(userId)} className="ml-1 bg-third hover:bg-third/90 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="space-y-2 max-h-[40vh] overflow-y-auto">
          {users?.map((user) => (
            <Card
              key={user.id}
              className={`${
                !shoppingList.shared_users.find((incUser) => incUser.id === user.id) ? 'cursor-pointer hover:bg-slate-50' : ''
              } transition-all duration-200 hover:shadow-md ${selectedUserIds.includes(user.id) ? 'bg-secondary border-border' : ''}`}
              onClick={() => {
                if (shoppingList.shared_users.find((incUser) => incUser.id === user.id)) return;
                handleUserToggle(user.id);
              }}
            >
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Checkbox checked={selectedUserIds.includes(user.id)} onChange={() => handleUserToggle(user.id)} className="flex-shrink-0" />

                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.image_src || '/placeholder.png'} alt={user.fullname} />
                      <AvatarFallback className="bg-sky-100 text-sky-700 font-medium">{getInitials(user.fullname)}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-800 truncate">{user.fullname}</h4>
                    </div>
                    {user.bio && <p className="text-xs text-slate-400 truncate">{user.bio}</p>}
                    <p className="text-xs text-slate-400">Joined {formatJoinDate(user.created_at)}</p>
                  </div>

                  {shoppingList.shared_users.find((incUser) => incUser.id === user.id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => unShareList(shoppingList.id, user.id)}
                      className="text-final hover:text-final/90 hover:bg-final/20"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {users?.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No users found</p>
              {searchQuery && <p className="text-sm mt-1">Try adjusting your search terms</p>}
            </div>
          )}

          <PaginationNavigation pagination={pagination} onPageChange={setCurPage} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
          <Button  onClick={() => handleShare()} disabled={selectedUserIds.length === 0 || isSharing}>
            {isSharing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share List
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
