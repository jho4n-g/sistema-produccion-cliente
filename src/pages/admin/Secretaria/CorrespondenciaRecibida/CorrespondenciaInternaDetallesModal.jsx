import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline';

import PdfPreviewTW from '@components/PdfPreviewTW';
import { getDocumentsView } from '@service/secretaria/CorrespondeciaRecibida.services.js';
import { normalizarFecha } from '@helpers/normalze.helpers';
import FieldDetail from '@components/FieldDetail';

const formatDate = (value) => {
  if (!value) return '-';
  if (typeof value === 'string')
    return value.includes('T') ? value.split('T')[0] : value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toISOString().split('T')[0];
};

const Field = ({ label, value, colSpan = 'md:col-span-6' }) => (
  <div className={colSpan}>
    <p className="text-xs font-bold text-slate-500">{label}</p>
    <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
      {value ?? '-'}
    </div>
  </div>
);

export default function CorrespondenciaRecibidaInternaDetalelsModal({
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

  const copyAll = async () => {
    if (!row) return;

    const text = [
      `Fecha: ${formatDate(row.fecha)}`,
      `Cite: ${row.cite ?? '-'}`,
      `Referencia: ${row.referencia ?? '-'}`,
      `Emitido por: ${row.emitido_por ?? '-'}`,
      `Derivado a: ${row.derivado_a ?? '-'}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copiado ✅');
    } catch {
      toast.error('No se pudo copiar');
    }
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
          // tu API a veces usa dato o row
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
                onClick={copyAll}
                disabled={loading || !row}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                title="Copiar datos"
              >
                <span className="inline-flex items-center gap-2">
                  <ClipboardIcon className="h-5 w-5" />
                  Copiar
                </span>
              </button>

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
            {/* Details card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <FieldDetail
                  label="Fecha"
                  value={normalizarFecha(row?.fecha)}
                  colSpan="md:col-span-2"
                />
                <FieldDetail
                  label="Cite"
                  value={row?.cite}
                  colSpan="md:col-span-3"
                />
                <FieldDetail
                  label="Referencia"
                  value={row?.referencia}
                  colSpan="md:col-span-6"
                />
                <FieldDetail
                  label="Emitido por"
                  value={row?.emitido_por}
                  colSpan="md:col-span-6"
                />
                <FieldDetail
                  label="Derivado a"
                  value={row?.derivado_a}
                  colSpan="md:col-span-6"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-900">
                Vista previa del documento
              </p>

              {id ? (
                <PdfPreviewTW documentoId={id} getDocument={getDocumentsView} />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 text-center">
                  <p className="text-sm text-slate-600">
                    No hay documento para previsualizar.
                  </p>
                </div>
              )}
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
