export default function PaginationBar({
  filteredLength,
  page,
  pageSize = 2,
  totalPages,
  onPageChange,
}) {
  const start = filteredLength > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, filteredLength);

  // genera lista de páginas (simple)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Mostrando{' '}
        <strong className="text-slate-800">
          {start}-{end}
        </strong>{' '}
        de <strong className="text-slate-800">{filteredLength}</strong>{' '}
        documentos
      </p>

      <nav className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={[
            'rounded-xl px-3 py-2 text-sm font-semibold transition',
            page <= 1
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
          ].join(' ')}
        >
          Anterior
        </button>

        {/* Pages */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p) => {
            const active = p === page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={[
                  'h-10 w-10 rounded-xl text-sm font-semibold transition',
                  active
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
                ].join(' ')}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={[
            'rounded-xl px-3 py-2 text-sm font-semibold transition',
            page >= totalPages
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
          ].join(' ')}
        >
          Siguiente
        </button>
      </nav>
    </div>
  );
}
