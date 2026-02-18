import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import FieldDetail from '@components/FieldDetail';

export default function InventarioMedicinaDetallesModal({
  open,
  onClose,
  fetchById,
  id,
  onEdit, // (id) => void
  onDelete, // async (id) => void
  title = 'Detalle - Inventario medico',
}) {
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const closeModal = () => {
    setRow(null);
    setDeleting(false);
    onClose();
  };

  useEffect(() => {
    if (!open || !id) return;

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const data = await fetchById(id);
        if (!active) return;

        if (data?.ok) {
          setRow(data.dato ?? data.row ?? {});
        } else {
          toast.error(data?.message || 'No se pudo cargar el registro');
          setRow(null);
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={loading || deleting ? undefined : closeModal}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-3xl max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        {/* Loading overlay */}
        {(loading || deleting) && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                {deleting ? 'Eliminando…' : 'Cargando datos…'}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

          <button
            type="button"
            onClick={loading || deleting ? undefined : closeModal}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="md:col-span-1 lg:col-span-3">
              <FieldDetail label="Código" value={row?.codigo} />
            </div>

            <div className="md:col-span-1 lg:col-span-6">
              <FieldDetail label="Descripción" value={row?.descripcion} />
            </div>

            <div className="md:col-span-1 lg:col-span-6">
              <FieldDetail label="Cotción" value={row?.cotcion} />
            </div>

            <div className="md:col-span-1 lg:col-span-6">
              <FieldDetail label="Unidad" value={row?.unidad} />
            </div>

            <div className="md:col-span-1 lg:col-span-6">
              <FieldDetail label="Saldo actual" value={row?.saldo_actual} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t border-slate-200 bg-white sticky bottom-0">
          <button
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            onClick={closeModal}
            disabled={loading || deleting}
          >
            Cerrar
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-3 py-2 text-white hover:bg-emerald-900 disabled:opacity-60"
            onClick={() => onEdit?.(id)}
            disabled={loading || deleting}
          >
            <PencilSquareIcon className="h-5 w-5" />
            Editar
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900 disabled:opacity-60"
            onClick={() => onDelete?.(id)}
            disabled={loading || deleting}
          >
            <TrashIcon className="h-5 w-5" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
