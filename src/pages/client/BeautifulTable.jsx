import React, { useMemo, useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

function cx(...c) {
  return c.filter(Boolean).join(' ');
}

const DATA = [
  {
    id: 'R-10291',
    paciente: 'CATALINA MONTAN OSSIO',
    modulo: 'Citas',
    fecha: '2025-12-15 09:12',
    estado: 'OK',
  },
  {
    id: 'R-10292',
    paciente: 'ALEJANDRO W. DOMINGUEZ',
    modulo: 'Afiliados',
    fecha: '2025-12-15 08:40',
    estado: 'OK',
  },
  {
    id: 'R-10293',
    paciente: 'WILLIAN DOMINGUEZ',
    modulo: 'Establecimientos',
    fecha: '2025-12-14 17:30',
    estado: 'WARN',
  },
  {
    id: 'R-10294',
    paciente: 'YESSICA RIVERA',
    modulo: 'Citas',
    fecha: '2025-12-14 13:10',
    estado: 'ERROR',
  },
  {
    id: 'R-10295',
    paciente: 'MARIO QUISPE',
    modulo: 'Citas',
    fecha: '2025-12-14 11:05',
    estado: 'OK',
  },
  {
    id: 'R-10296',
    paciente: 'JUAN PEREZ',
    modulo: 'Afiliados',
    fecha: '2025-12-14 10:20',
    estado: 'WARN',
  },
  {
    id: 'R-10297',
    paciente: 'ANA LOPEZ',
    modulo: 'Citas',
    fecha: '2025-12-13 16:40',
    estado: 'OK',
  },
  {
    id: 'R-10298',
    paciente: 'CARLA ROJAS',
    modulo: 'Establecimientos',
    fecha: '2025-12-13 14:02',
    estado: 'OK',
  },
  {
    id: 'R-10299',
    paciente: 'PEDRO FLORES',
    modulo: 'Citas',
    fecha: '2025-12-13 09:55',
    estado: 'ERROR',
  },
  {
    id: 'R-10300',
    paciente: 'LUIS MAMANI',
    modulo: 'Citas',
    fecha: '2025-12-12 18:30',
    estado: 'OK',
  },
  {
    id: 'R-10301',
    paciente: 'SOFIA TORREZ',
    modulo: 'Afiliados',
    fecha: '2025-12-12 12:10',
    estado: 'OK',
  },
  {
    id: 'R-10302',
    paciente: 'DIEGO VARGAS',
    modulo: 'Citas',
    fecha: '2025-12-12 08:15',
    estado: 'WARN',
  },
];

export default function BeautifulTable() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('ALL');

  // ✅ paginado
  const [pageSize, setPageSize] = useState(10); // cuánto ver
  const [page, setPage] = useState(1); // 1-based

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return DATA.filter((r) => {
      const matchesQ =
        !qq ||
        r.id.toLowerCase().includes(qq) ||
        r.paciente.toLowerCase().includes(qq) ||
        r.modulo.toLowerCase().includes(qq);

      const matchesStatus = status === 'ALL' ? true : r.estado === status;
      return matchesQ && matchesStatus;
    });
  }, [q, status]);

  // ✅ si cambia filtro/busqueda/tamaño, vuelve a página 1
  React.useEffect(() => {
    setPage(1);
  }, [q, status, pageSize]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = startIdx + pageSize;

  const pageRows = filtered.slice(startIdx, endIdx);

  const from = total === 0 ? 0 : startIdx + 1;
  const to = Math.min(endIdx, total);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold">Actividad / Reservas</h2>
        <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Nueva reserva
        </button>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por ID, paciente o módulo..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            {/* Filter + page size */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <FunnelIcon className="h-5 w-5 text-slate-500" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-transparent text-sm outline-none"
                >
                  <option value="ALL">Todos</option>
                  <option value="OK">OK</option>
                  <option value="WARN">WARN</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <span className="text-sm text-slate-600">Ver</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-transparent text-sm outline-none"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-600">filas</span>
              </div>

              <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Paciente</th>
                <th className="px-5 py-3">Módulo</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {pageRows.map((r, idx) => (
                <tr
                  key={r.id}
                  className={cx(
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60',
                    'hover:bg-slate-50'
                  )}
                >
                  <td className="px-5 py-3 font-medium">{r.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-2xl bg-linear-to-br from-indigo-500 to-fuchsia-500" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{r.paciente}</p>
                        <p className="truncate text-xs text-slate-500">
                          Detalle corto del registro
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {r.modulo}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{r.fecha}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.estado} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 hover:bg-slate-50">
                      <EllipsisVerticalIcon className="h-5 w-5 text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No hay resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer paginado */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Mostrando <b>{from}</b>–<b>{to}</b> de <b>{total}</b>
          </span>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className={cx(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold',
                safePage <= 1
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              )}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Anterior
            </button>

            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span>
                Página <b>{safePage}</b> / <b>{totalPages}</b>
              </span>
              <span className="mx-2 h-4 w-px bg-slate-200" />
              <span>Ir a</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={safePage}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isFinite(v)) return;
                  setPage(Math.min(Math.max(1, v), totalPages));
                }}
                className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-slate-400"
              />
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className={cx(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold',
                safePage >= totalPages
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              )}
            >
              Siguiente
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === 'OK'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : status === 'WARN'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-rose-100 text-rose-700 border-rose-200';

  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold',
        styles
      )}
    >
      {status}
    </span>
  );
}
