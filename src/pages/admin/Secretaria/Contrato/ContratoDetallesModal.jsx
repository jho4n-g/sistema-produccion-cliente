import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline';

import PdfPreviewTW from '@components/PdfPreviewTW';
import FieldDetail from '@components/FieldDetail'; // el componente que creaste
import { getDocumentsView } from '@service/secretaria/Contrato.services.js';
import { normalizarFecha } from '@helpers/normalze.helpers';

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2 }).format(
    num,
  );
};

export default function ContratoDetallesModal({
  open,
  onClose,
  fetchById,
  id,
  title = 'Detalle del contrato',
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
      `Número contrato/cite: ${row.n_contrato_cite ?? '-'}`,
      `Área contrato: ${row.area_contrato ?? '-'}`,
      `Empresa: ${row.empresa ?? '-'}`,
      `Proveedor: ${row.proveedor ?? '-'}`,
      `Objeto: ${row.objeto ?? '-'}`,
      `Monto contrato: ${formatMoney(row.monto_contrato)}`,
      `Fecha inicio: ${normalizarFecha(row.fecha_inicio)}`,
      `Finalización: ${normalizarFecha(row.finalizacion_contrato)}`,
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
                  label="N° Contrato / Cite"
                  value={row?.n_contrato_cite ?? '-'}
                  colSpan="md:col-span-3"
                />
                <FieldDetail
                  label="Área del contrato"
                  value={row?.area_contrato ?? '-'}
                  colSpan="md:col-span-3"
                />
                <FieldDetail
                  label="Empresa"
                  value={row?.empresa ?? '-'}
                  colSpan="md:col-span-6"
                />

                <FieldDetail
                  label="Proveedor"
                  value={row?.proveedor ?? '-'}
                  colSpan="md:col-span-6"
                />
                <FieldDetail
                  label="Objeto"
                  value={row?.objeto ?? '-'}
                  colSpan="md:col-span-6"
                />

                <FieldDetail
                  label="Monto del contrato"
                  value={formatMoney(row?.monto_contrato)}
                  colSpan="md:col-span-3"
                />
                <FieldDetail
                  label="Fecha de inicio"
                  value={normalizarFecha(row?.fecha_inicio)}
                  colSpan="md:col-span-3"
                />
                <FieldDetail
                  label="Finalización del contrato"
                  value={normalizarFecha(row?.finalizacion_contrato)}
                  colSpan="md:col-span-3"
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
