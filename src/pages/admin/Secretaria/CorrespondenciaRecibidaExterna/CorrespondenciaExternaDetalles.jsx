import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { normalizarFecha } from '@helpers/normalze.helpers';
import FieldDetail from '@components/FieldDetail';

export default function CorrespondenciaExternaDetalles({
  open,
  onClose,
  fetchById,
  id,
  title = 'Detalle del documento',
}) {
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setRow(null);
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
          // tu API a veces devuelve "dato" o "row"
          setRow(data.dato ?? data.row ?? {});
        } else {
          toast.error(data?.message || 'No se pudo cargar el registro');
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
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={loading ? undefined : closeModal}
        />

        {/* Modal */}
        <div className="relative z-10 w-[92%] max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loading ? undefined : closeModal}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <FieldDetail
                  label="Fecha entregado"
                  value={normalizarFecha(row?.fecha_entregado)}
                  colSpan="md:col-span-2"
                />

                <FieldDetail
                  label="Entregado por"
                  value={row?.entregado_por}
                  colSpan="md:col-span-6"
                />
                <FieldDetail
                  label="Documento"
                  value={row?.documento}
                  colSpan="md:col-span-6"
                />

                <FieldDetail
                  label="Descripción"
                  value={row?.descripcion}
                  colSpan="md:col-span-6"
                />
                <FieldDetail
                  label="Entregado a"
                  value={row?.entragado_a}
                  colSpan="md:col-span-6"
                />
                <FieldDetail
                  label="Enviado por"
                  value={row?.enviado_por}
                  colSpan="md:col-span-6"
                />
                <FieldDetail
                  label="Fecha devolución"
                  value={normalizarFecha(row?.fecha_devolucion)}
                  colSpan="md:col-span-2"
                />
                <FieldDetail
                  label="Devolucion"
                  value={row?.dev}
                  colSpan="md:col-span-6"
                />

                <FieldDetail
                  label="Derivado a"
                  value={row?.derivado_a}
                  colSpan="md:col-span-6"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-4">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cerrar ventana
              </button>
            </div>
          </div>

          {/* loading overlay */}
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
    </>
  );
}
