import { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';

const columnas = [
  { label: 'Turno', key: 'turno' },
  { label: 'Tipo concepto', key: 'tipo_concepto' },
  { label: 'Formato', key: 'formato' },
  { label: 'A1', key: 'a1' },
  { label: 'A2', key: 'a2' },
  { label: 'A3', key: 'a3' },
  { label: 'B1', key: 'b1' },
  { label: 'B2', key: 'b2' },
  { label: 'B3', key: 'b3' },
];

const n = (v) => {
  const num = Number(v);
  return Number.isFinite(num) ? num : 0;
};

export default function InformeProduccionModal({
  open,
  onClose,
  fetchById, // (id) => Promise<{ok, datos:{data:{DatosMetros,totalTurno,totalTipo,cajas}}}>
  id,
  title,
}) {
  const [loading, setLoading] = useState(false);

  const [datosFinales, setDatosFinales] = useState({
    DatosMetros: [],
    totalTurno: [],
    totalTipo: [],
    cajas: [],
  });

  const datosMetros = datosFinales.DatosMetros;

  const load = useCallback(async () => {
    try {
      if (!open) return;

      const safeId = Number(id);
      if (!Number.isFinite(safeId) || safeId <= 0) {
        // si abren modal sin id, solo limpiamos y no pedimos nada
        setDatosFinales({
          DatosMetros: [],
          totalTurno: [],
          totalTipo: [],
          cajas: [],
        });
        return;
      }

      setLoading(true);

      const resp = await fetchById?.(safeId);

      if (!resp?.ok) {
        toast.error(resp?.message || 'Error al cargar el informe');
        setDatosFinales({
          DatosMetros: [],
          totalTurno: [],
          totalTipo: [],
          cajas: [],
        });
        return;
      }

      const payload = resp?.datos?.data ?? {};

      setDatosFinales({
        DatosMetros: payload?.DatosMetros ?? [],
        totalTurno: payload?.totalTurno ?? [],
        totalTipo: payload?.totalTipo ?? [],
        cajas: payload?.cajas ?? [],
      });
    } catch (e) {
      toast.error(e?.message || 'Error al cargar el informe');
      setDatosFinales({
        DatosMetros: [],
        totalTurno: [],
        totalTipo: [],
        cajas: [],
      });
    } finally {
      setLoading(false);
    }
  }, [open, id, fetchById]);

  useEffect(() => {
    if (!open) return;
    load();
  }, [open, load]);

  const totalTurno = datosFinales?.totalTurno ?? [];
  const turno1 = totalTurno.find((t) => t.turno === 'Primero')?.total ?? 0;
  const turno2 = totalTurno.find((t) => t.turno === 'Segundo')?.total ?? 0;
  const turno3 = totalTurno.find((t) => t.turno === 'Tercero')?.total ?? 0;
  const totalGeneral = n(turno1) + n(turno2) + n(turno3);

  const totalCajas = datosFinales?.cajas ?? [];
  const turno1CajasA =
    totalCajas.find((t) => t.turno === 'Primero')?.totalA ?? 0;
  const turno1CajasB =
    totalCajas.find((t) => t.turno === 'Primero')?.totalB ?? 0;
  const turno2CajasA =
    totalCajas.find((t) => t.turno === 'Segundo')?.totalA ?? 0;
  const turno2CajasB =
    totalCajas.find((t) => t.turno === 'Segundo')?.totalB ?? 0;
  const turno3CajasA =
    totalCajas.find((t) => t.turno === 'Tercero')?.totalA ?? 0;
  const turno3CajasB =
    totalCajas.find((t) => t.turno === 'Tercero')?.totalB ?? 0;

  const sumaFila = useMemo(() => {
    // por si quieres un total general A/B en la tabla principal (opcional)
    const totalA = datosMetros.reduce(
      (acc, r) => acc + n(r.a1) + n(r.a2) + n(r.a3),
      0,
    );
    const totalB = datosMetros.reduce(
      (acc, r) => acc + n(r.b1) + n(r.b2) + n(r.b3),
      0,
    );
    return { totalA, totalB, total: totalA + totalB };
  }, [datosMetros]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onClose}
      />

      <div className="relative z-10 w-[92%] max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={loading ? undefined : onClose}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5 space-y-6">
          {/* TABLA PRINCIPAL: DatosMetros */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-black font-extrabold">
                Detalle (DatosMetros)
              </h3>
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Recargar
              </button>
            </div>

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
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {datosMetros.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border border-slate-300 divide-x divide-slate-200 hover:bg-slate-100/60 transition-colors"
                    >
                      {columnas.map((c) => (
                        <td
                          key={c.key}
                          className="border-b px-4 py-3 text-left whitespace-nowrap"
                        >
                          {row?.[c.key] ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {!datosMetros.length && (
                    <tr>
                      <td
                        className="px-4 py-4 text-slate-500"
                        colSpan={columnas.length}
                      >
                        {loading ? 'Cargando…' : 'Sin datos'}
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* (Opcional) Footer con totales de A/B */}
                {datosMetros.length > 0 && (
                  <tfoot className="bg-slate-50">
                    <tr className="divide-x divide-slate-200">
                      <td
                        className="border-t px-4 py-3 font-semibold"
                        colSpan={3}
                      >
                        Totales (A + B)
                      </td>
                      <td
                        className="border-t px-4 py-3 font-semibold"
                        colSpan={3}
                      >
                        A: {sumaFila.totalA}
                      </td>
                      <td
                        className="border-t px-4 py-3 font-semibold"
                        colSpan={3}
                      >
                        B: {sumaFila.totalB} | Total: {sumaFila.total}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Total produccion por producto (totalTipo) */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-black font-extrabold">
              Total producción por producto
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="w-full overflow-x-auto">
              <table className="min-w-max w-full table-auto border-separate border-spacing-0 text-sm">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr className="divide-x divide-slate-200">
                    <th className="border px-4 py-3 text-left font-semibold whitespace-nowrap">
                      PRODUCTO
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      TOTAL
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      PROGRAMADO
                    </th>
                    <th
                      className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap"
                      colSpan={2}
                    >
                      ACUMULADO
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {(datosFinales?.totalTipo ?? []).map((row, idx) => (
                    <tr
                      key={idx}
                      className="border border-slate-300 divide-x divide-slate-200 hover:bg-slate-100/60 transition-colors"
                    >
                      <td className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                        {row.tipo_concepto}
                      </td>
                      <td className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                        {row.total}
                      </td>
                      <td className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                        {row.total}
                      </td>
                      <td className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                        {row.total}
                      </td>
                      <td className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                        {row.total}
                      </td>
                    </tr>
                  ))}

                  {!datosFinales?.totalTipo?.length && (
                    <tr>
                      <td className="px-4 py-4 text-slate-500" colSpan={5}>
                        {loading ? 'Cargando…' : 'Sin datos'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total por turno (totalTurno) */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-black font-extrabold">Total por turno</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="w-full overflow-x-auto">
              <table className="min-w-max w-full table-auto border-separate border-spacing-0 text-sm">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr className="divide-x divide-slate-200">
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      TURNO 1
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      TURNO 2
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      TURNO 3
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      TOTAL PRODUCCIÓN
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="divide-x divide-slate-200">
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno1}
                    </td>
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno2}
                    </td>
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno3}
                    </td>
                    <td className="border px-4 py-3 text-left font-semibold">
                      {totalGeneral}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cajas por turno (cajas) */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="w-full overflow-x-auto">
              <table className="min-w-max w-full table-auto border-separate border-spacing-0 text-sm">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr className="divide-x divide-slate-200">
                    <th
                      className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap"
                      colSpan={2}
                    >
                      CAJAS PRIMER TURNO
                    </th>
                    <th
                      className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap"
                      colSpan={2}
                    >
                      CAJAS SEGUNDO TURNO
                    </th>
                    <th
                      className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap"
                      colSpan={2}
                    >
                      CAJAS TERCER TURNO
                    </th>
                  </tr>
                  <tr className="divide-x divide-slate-200">
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Extra
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Standar
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Extra
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Standar
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Extra
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Standar
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr className="divide-x divide-slate-200">
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno1CajasA}
                    </td>
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno1CajasB}
                    </td>
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno2CajasA}
                    </td>
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno2CajasB}
                    </td>
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno3CajasA}
                    </td>
                    <td className="border px-4 py-3 text-left font-semibold">
                      {turno3CajasB}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cerrar ventana
            </button>
          </div>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                Procesando…
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
