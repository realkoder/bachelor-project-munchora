import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PaginationNavigation } from '~/components/pagination-navigation';
import { Button } from '~/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { useDebounce } from '~/hooks/fetching/useDebounceSearch';
import useFetchUsers from '~/hooks/fetching/useFetchUsers';
import type { IUser } from '~/types/user.interface';

const UserManagement = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 800);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [curPage, setCurPage] = useState(1);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'; // Add ellipsis if truncated
    }
    return text;
  };

  return (
    <Card className="border">
      <CardHeader>
        <Collapsible open={isTableOpen} onOpenChange={setIsTableOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-transparent">
              <CardTitle className="text-xl text-slate-800">User Management</CardTitle>
              <CardDescription>Amount: {users?.length}</CardDescription>
              {isTableOpen ? <ChevronDown className="h-5 w-5 text-slate-500" /> : <ChevronRight className="h-5 w-5 text-slate-500" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <div className="relative my-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="text-slate-700 font-medium">Name</TableHead>
                    <TableHead className="text-slate-700 font-medium">Email</TableHead>
                    <TableHead className="text-slate-700 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users &&
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-secondary/30 text-left">
                        <TableCell>
                          {editingUser?.id === user.id ? (
                            <Input defaultValue={user.fullname} className="h-8" />
                          ) : (
                            <span className="text-slate-800">
                              {isMobile ? truncateText(user.fullname, 10) : user.fullname} {/* Truncate for mobile */}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingUser?.id === user.id ? (
                            <Input defaultValue={user.email} className="h-8" />
                          ) : (
                            <span className="text-slate-600">
                              {isMobile ? truncateText(user.email, 10) : user.email} {/* Truncate for mobile */}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => console.log('IMPLEMENT ME')}>
                            {editingUser?.id === user.id ? 'Save' : 'Edit'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <PaginationNavigation pagination={pagination} onPageChange={setCurPage} />
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
};

export default UserManagement;
