import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import EchartsStackedAreaChart from '@components/EchartsStackedAreaChart';

const makeInitialChart = () => ({ categories: [], series: [] });

export default function ModalChartDesempenio({
  open,
  onClose,
  fetchById,
  id,
  titleModal = 'Detalle',
  titleChart = 'Gráfico',
  mapResponseToChart, // (resp) => ({ categories: [], series: [] })
  height = 400,
  showToolbox = true,
}) {
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState(makeInitialChart);

  // ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, loading, onClose]);

  // Fetch al abrir
  useEffect(() => {
    if (!open || id == null) return;

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const resp = await fetchById(id);
        console.log('***Desempeño***');
        console.log(resp);
        if (!active) return;

        if (!resp?.ok) {
          toast.error(resp?.message || 'No se pudo cargar el registro');
          return;
        }

        const mapped = mapResponseToChart?.(resp) ?? makeInitialChart();
        setChart({
          categories: mapped.categories ?? [],
          series: mapped.series ?? [],
        });
      } catch (e) {
        if (active) toast.error(e?.message || 'Error del servidor');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById, mapResponseToChart]);

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      setChart(makeInitialChart());
      setLoading(false);
    }
  }, [open]);

  const series = useMemo(() => chart.series ?? [], [chart.series]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                {titleModal}
              </h3>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <EchartsStackedAreaChart
                    title={titleChart}
                    categories={chart.categories}
                    series={series}
                    height={height}
                    showToolbox={showToolbox}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-slate-200">
              <button
                className="rounded-xl bg-slate-200 px-3 py-2 text-slate-900 hover:bg-slate-300"
                onClick={onClose}
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
