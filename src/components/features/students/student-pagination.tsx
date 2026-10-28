import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface StudentPaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  onPageChange: (page: number) => void;
}

function buildPages(current: number, last: number): Array<number | "ellipsis"> {
  const pages: Array<number | "ellipsis"> = [];
  const push = (n: number) => {
    if (n >= 1 && n <= last && !pages.includes(n)) pages.push(n);
  };

  push(1);
  if (current > 3) pages.push("ellipsis");
  for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i += 1) {
    push(i);
  }
  if (current < last - 2) pages.push("ellipsis");
  push(last);

  return pages;
}

function PageButton({
  page,
  active,
  disabled,
  onClick,
  children,
}: {
  page: number;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={`Go to page ${page}`}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
        active
          ? "border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30"
          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800",
      )}
    >
      {children ?? page}
    </button>
  );
}

export function StudentPagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
}: StudentPaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row dark:border-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {from ?? 0}–{to ?? 0}
        </span>{" "}
        of <span className="font-semibold text-slate-700 dark:text-slate-200">{total}</span> students
      </p>

      <nav className="flex items-center gap-1.5" aria-label="Pagination">
        <PageButton
          page={currentPage - 1}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon className="size-4" />
        </PageButton>

        {buildPages(currentPage, lastPage).map((entry, index) =>
          entry === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-sm text-slate-400"
            >
              …
            </span>
          ) : (
            <PageButton
              key={entry}
              page={entry}
              active={entry === currentPage}
              onClick={() => onPageChange(entry)}
            />
          ),
        )}

        <PageButton
          page={currentPage + 1}
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon className="size-4" />
        </PageButton>
      </nav>
    </div>
  );
}