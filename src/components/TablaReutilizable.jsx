import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { toast } from 'react-toastify';
import { normalize } from '../helpers/normalze.helpers';

const TablaReutilizable = forwardRef(function TablaReutilizable(
  {
    getObj,
    datosBusqueda,
    titulo,
    columnas,
    hanldeDelete,
    handleEdit,
    handleDetail,
  },
  ref
) {
  const [query, setQuery] = useState('');

  const [row, setRow] = useState([]);
  const [loading, setLoading] = useState(false);

  // paginado (cliente)
  const [page, setPage] = useState(0); // 0-based
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const obj = await getObj();
      if (obj.ok) {
        setRow(Array.isArray(obj?.datos) ? obj.datos : []);
      }
      if (!obj.ok) {
        toast.error(obj.message || 'Error al cargar lo datos');
      }
    } catch (e) {
      toast.error(e.message || 'Error al cargar lo datos');
    } finally {
      setLoading(false);
    }
  }, [getObj]);

  useImperativeHandle(ref, () => ({
    reload,
  }));

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return row;
    return row.filter((r) => {
      // Busca en columnas simples
      const matchSimple = datosBusqueda.some((k) =>
        normalize(r?.[k]).includes(q)
      );
      return matchSimple;
    });
  }, [row, query, datosBusqueda]);

  // slice de paginado en cliente
  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  useEffect(() => {
    setPage(0);
  }, [query, rowsPerPage]);

  const pagesToShow = useMemo(() => {
    const total = totalPages;
    const current = page; // 0-based
    const windowSize = 5; // cantidad de botones visibles

    if (total <= windowSize) return Array.from({ length: total }, (_, i) => i);

    const half = Math.floor(windowSize / 2);
    let start = Math.max(0, current - half);
    let end = Math.min(total - 1, start + windowSize - 1);

    // Ajuste si estamos al final
    start = Math.max(0, end - (windowSize - 1));

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text">{titulo}</h2>
        </div>
        <div className="rounded-lg border-2  border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative w-full max-w-sm">
            {/* Icono izquierda */}
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Buscar por Nombre..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900
                    focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />

            {/* Botón limpiar */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-4  rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="min-w-max w-full table-auto border-separate border-spacing-0 text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr className="divide-x divide-slate-200">
                  {columnas.map((c) => (
                    <th
                      key={c.key}
                      className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap"
                    >
                      {c.label}
                    </th>
                  ))}
                  <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={columnas.length + 1}
                      className="px-4 py-8 text-center text-sm text-slate-600"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                        Cargando datos...
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnas.length + 1}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No hay registros
                    </td>
                  </tr>
                ) : (
                  paginated.map((data, index) => (
                    <tr
                      key={data.id ?? `${data.fecha}-${index}`}
                      className="border border-slate-300  divide-x divide-slate-200 hover:bg-slate-100/60 transition-colors"
                    >
                      {columnas.map((c) => (
                        <td key={c.key} className="px-4 py-3">
                          {c.render ? c.render(data) : data[c.key]}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <button
                            className="
                              rounded-xl
                              bg-white
                              px-3 py-2
                              text-reen-900
                              ring-1 ring-green-900
                              hover:bg-emerald-100
                            "
                            onClick={() => handleDetail?.(data.id)}
                          >
                            Detalles
                          </button>
                          <button
                            type="button"
                            className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                            onClick={() => handleEdit?.(data.id)}
                          >
                            Editar
                          </button>

                          <button
                            className="rounded-xl bg-red-700 px-3 py-2 text-white hover:bg-red-900"
                            onClick={() => hanldeDelete?.(data.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Filas por página */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Filas:</span>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <span className="ml-2">
                {filtered.length === 0
                  ? '0'
                  : `${page * rowsPerPage + 1}-${Math.min(
                      (page + 1) * rowsPerPage,
                      filtered.length
                    )}`}{' '}
                de {filtered.length}
              </span>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Anterior
              </button>

              {/* Primera página + ... */}
              {pagesToShow[0] > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setPage(0)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    1
                  </button>
                  <span className="px-1 text-slate-400">…</span>
                </>
              )}

              {/* Páginas visibles */}
              {pagesToShow.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    'rounded-xl px-3 py-1.5 text-sm border',
                    p === page
                      ? 'border-green-900 bg-green-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {p + 1}
                </button>
              ))}

              {/* ... + última página */}
              {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && (
                <>
                  <span className="px-1 text-slate-400">…</span>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages - 1)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                type="button"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                Siguiente
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default TablaReutilizable;
