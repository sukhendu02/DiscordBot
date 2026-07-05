import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination({
  page,
  totalPages,
  onPageChange,
}) {
  const pages = [];

  let start = Math.max(1, page - 1);
  let end = Math.min(totalPages, start + 2);

  if (end - start < 2) {
    start = Math.max(1, end - 2);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-end gap-1 py-4 bg-gray-100">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-md hover:bg-gray-300 cursor-pointer text-primary disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {start > 1 && (
        <>
          <PageButton page={1} active={page === 1} onPageChange={onPageChange} />
          {start > 2 && <span className="px-2 text-on-surface-variant">...</span>}
        </>
      )}

      {pages.map((p) => (
        <PageButton
          key={p}
          page={p}
          active={page === p}
          onPageChange={onPageChange}
        />
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-2 text-on-surface-variant">...</span>
          )}
          <PageButton
            page={totalPages}
            active={page === totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-md hover:bg-gray-300 text-primary cursor-pointer disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function PageButton({ page, active, onPageChange }) {
  return (
    <button
      onClick={() => onPageChange(page)}
      className={`w-8 h-8 rounded-md text-sm transition ${
        active
          ? "bg-primary text-white"
          : "hover:bg-gray-300 cursor-pointer text-on-surface"
      }`}
    >
      {page}
    </button>
  );
}