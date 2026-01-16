import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
  showControls?: boolean;
  isCompact?: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  current,
  total,
  onPageChange,
  isCompact = false,
}) => {
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (current > 1) {
      onPageChange(current - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (current < total) {
      onPageChange(current + 1);
    }
  };

  const handlePageChange = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page >= 1 && page <= total) {
      onPageChange(page);
    }
  };

  const getPaginationRange = () => {
    const range: number[] = [];
    let startPage = current - 1;
    let endPage = current + 1;

    if (current === 1) {
      startPage = 1;
      endPage = Math.min(3, total);
    } else if (current === total) {
      startPage = Math.max(total - 2, 1);
      endPage = total;
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i >= 1 && i <= total) {
        range.push(i);
      }
    }
    return range;
  };

  const paginationItems = getPaginationRange();

  const handleTotalPageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(total);
  };

  return (
    <Pagination className={isCompact ? "scale-90" : ""}>
      <PaginationContent className="flex-wrap gap-2">
        
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            className={`transition-all duration-200 ${
              current === 1
                ? "pointer-events-none opacity-50 cursor-not-allowed" 
                : "cursor-pointer hover:bg-accent"
            }`}
            aria-disabled={current === 1}
          />
        </PaginationItem>

        {paginationItems.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={current === page}
              onClick={(e) => handlePageChange(e, page)}
              className={`cursor-pointer transition-all duration-200 ${
                current === page
                  ? "shadow-sm bg-primary text-foreground font-bold hover:bg-primary/90" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {total > 3 && current < total - 1 && (
          <>
            <PaginationItem>
              <PaginationEllipsis className="text-muted-foreground/60" />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={handleTotalPageClick}
                className="cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                {total}
              </PaginationLink>
            </PaginationItem>
          </>
        )}


        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            className={`transition-all duration-200 ${
              current === total
                ? "pointer-events-none opacity-50 cursor-not-allowed" 
                : "cursor-pointer hover:bg-accent"
            }`}
            aria-disabled={current === total}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;