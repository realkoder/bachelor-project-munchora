import { Button } from '~/components/ui/button';
import type { IPaginationMeta } from '~/hooks/fetching/usePaginatedQuery';

interface RecipesPaginationProps {
  pagination?: IPaginationMeta;
  onPageChange: (newPage: number) => void;
}

export const PaginationNavigation = ({ pagination, onPageChange }: RecipesPaginationProps) => {
  if (!pagination) return null;
  const { current_page, total_pages } = pagination;

  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      <Button variant="outline" onClick={() => onPageChange(current_page - 1)} disabled={current_page <= 1}>
        ← Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {current_page} of {total_pages}
      </span>

      <Button variant="outline" onClick={() => onPageChange(current_page + 1)} disabled={current_page >= total_pages}>
        Next →
      </Button>
    </div>
  );
};
