import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import EchartsStackedAreaChart from '@components/EchartsStackedAreaChart';

const initialChart = {
  categories: [],
  produccion: [],
  consumo_mensual: [],
};

export default function ModalDesempeñoMes({ open, onClose, fetchById, id }) {
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState(initialChart);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, loading, onClose]);

  // Fetch data al abrir
  useEffect(() => {
    if (!open || !id) return;

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const resp = await fetchById(id);

        if (!active) return;
        console.log(resp);
        if (resp?.ok) {
          const g = resp?.datos?.datoGrafico ?? {};
          setChart({
            categories: g.categories ?? [],
            produccion: g.produccion ?? [],
            consumo_mensual: g.consumo_mensual ?? [],
          });
        } else {
          toast.error(resp?.message || 'No se pudo cargar el registro');
        }
      } catch (e) {
        if (active) toast.error(e?.message || 'Error del servidor');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById]);

  // Reset al cerrar (evita “data vieja”)
  useEffect(() => {
    if (!open) {
      setChart(initialChart);
      setLoading(false);
    }
  }, [open]);

  const series = useMemo(
    () => [
      { name: 'Produccion', data: chart.produccion },
      { name: 'Consumo mensual', data: chart.consumo_mensual },
    ],
    [chart.produccion, chart.consumo_mensual],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                   max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                Cargando datos…
              </p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Desempeño del mes
              </h3>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <EchartsStackedAreaChart
                    title="Indice consumo bases"
                    categories={chart.categories}
                    series={series}
                    height={400}
                    showToolbox
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
              <button
                className="rounded-xl bg-slate-200 px-3 py-2 text-slate-900 hover:bg-slate-300"
                onClick={onClose}
                disabled={loading}
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
