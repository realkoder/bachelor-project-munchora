import { Calendar, ChevronDown, ChevronRight, MessageSquare, Settings, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PaginationNavigation } from '~/components/pagination-navigation';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import useFetchFeedback from '~/hooks/fetching/useFetchFeedback';
import type { IFeedback } from '~/types/feedback.interface';

export const Feedback = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(null);
  const [curPage, setCurPage] = useState(1);
  const { feedbacks, pagination } = useFetchFeedback(curPage);
  const [isMobile, setIsMobile] = useState(false);

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
    <div>
      <Card className="border">
        <CardHeader>
          <Collapsible open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <div className='flex flex-col'>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Feedback Management
                  </CardTitle>
                  <CardDescription>Amount: {feedbacks?.length || 0}</CardDescription>
                </div>
                {isFeedbackOpen ? <ChevronDown className="h-5 w-5 text-slate-500" /> : <ChevronRight className="h-5 w-5 text-slate-500" />}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="text-slate-700 font-medium">User</TableHead>
                      <TableHead className="text-slate-700 font-medium">{isMobile ? 'Cat' : 'Category'}</TableHead>
                      {!isMobile && <TableHead className="text-slate-700 font-medium">Message</TableHead>}
                      <TableHead className="text-slate-700 font-medium">Date</TableHead>
                      <TableHead className="text-slate-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks &&
                      feedbacks.map((item) => (
                        <TableRow key={item.id} className="hover:bg-secondary/30 text-left">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-slate-400" />
                              <div>
                                <div className="text-slate-800 font-medium">{isMobile ? truncateText(item.name, 5) : item.name}</div>
                                <div className="text-slate-500 text-sm">{isMobile ? truncateText(item.email, 5) : item.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border text-fourth">
                              {isMobile ? item.category.substring(0, 4) : item.category}
                            </Badge>
                          </TableCell>
                          {!isMobile && (
                            <TableCell className="max-w-xs">
                              <div className="text-slate-600 truncate" title={item.message}>
                                {item.message.substring(0, 35)}
                              </div>
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Calendar className="h-4 w-4" />
                              {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => setSelectedFeedback(item)} className="border text-final hover:bg-secondary/30">
                              <Settings className="h-4 w-4" />
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

      <Dialog open={selectedFeedback !== null} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback Details
            </DialogTitle>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <DialogDescription className="text-sm font-medium text-slate-600">User</DialogDescription>
                  <div className="mt-1">
                    <div className="text-slate-800 font-medium">{selectedFeedback.name}</div>
                    <div className="text-slate-500 text-sm">{selectedFeedback.email}</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Category</label>
                  <div className="mt-1">
                    <Badge variant="outline" className="border-sky-200 text-sky-700">
                      {selectedFeedback.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Date</label>
                  <div className="mt-1 text-slate-800"> {selectedFeedback.created_at ? new Date(selectedFeedback.created_at).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Message</label>
                <div className="mt-2 p-4 bg-slate-50 rounded-lg border">
                  <p className="text-slate-800 whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>
              </div>

              <Button variant="outline" onClick={() => setSelectedFeedback(null)} className="border-slate-200 text-slate-600 hover:bg-slate-50">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
