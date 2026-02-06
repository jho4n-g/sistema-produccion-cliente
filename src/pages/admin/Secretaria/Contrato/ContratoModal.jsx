import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

import PdfPreviewTW from '@components/PdfPreviewTW'; // tu preview con tailwind
import InputField from '@components/InputField';

// services + schema (igual que tu MUI)
import { getDocumentsView } from '@service/secretaria/Contrato.services.js';
import { DatosContrato } from '@schema/secretaria/Contrato.schema.js';

const initialForm = () => ({
  n_contrato_cite: '',
  area_contrato: '',
  empresa: '',
  proveedor: '',
  objeto: '',
  monto_contrato: '',
  fecha_inicio: '',
  finalizacion_contrato: '',
});

export default function PoliticaModal({
  open,
  onClose,
  fetchById,
  isEditing = false,
  onSave,
  id,
}) {
  const [form, setForm] = useState(initialForm());
  const [file, setFile] = useState(null);
  const [error, setError] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);

  const title = isEditing ? 'Edición del documento' : 'Nuevo documento';

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };
  useEffect(() => {
    if (!open) {
      // al cerrar → limpiar TODO
      setForm(initialForm());
      setFile(null);
      setPreviewUrl(null);
      setError({});
      setLoading(false);
      return;
    }
    // al abrir en modo crear
    if (!isEditing) {
      setForm(initialForm());
      setFile(null);
      setPreviewUrl(null);
      setError({});
    }
  }, [open, isEditing]);

  useEffect(() => {
    if (!open || !id) return; // evita correr si no aplica

    let active = true; // evita setState tras unmount
    setLoading(true);

    (async () => {
      try {
        const data = await fetchById(id); // ← ahora sí esperamos aquí

        if (!active) return;

        if (data?.ok) {
          setForm(data.dato ?? {});
        } else {
          toast.error(data?.message || 'No se pudo cargar el registro');
        }
      } catch (e) {
        if (active) toast.error(e?.message || 'Error del servidor');
      } finally {
        if (active) setLoading(false); // ← se apaga al terminar de verdadfi
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById]);

  // preview del PDF seleccionado
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }
    setFile(f);
  };

  const closeModal = () => {
    setForm(initialForm());
    setFile(null);
    setPreviewUrl(null);
    setError({});
    onClose();
  };

  const validate = () => {
    const result = DatosContrato.safeParse(form);
    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return null;
    }
    if (!isEditing && !file) {
      toast.error('Debe subir un documento PDF');
      return null;
    }

    // 3️⃣ Validar tipo de archivo (extra recomendado)
    if (file && file.type !== 'application/pdf') {
      toast.error('El archivo debe ser un PDF');
      return null;
    }
    return result.data;
  };

  const handleCreate = async () => {
    const parsed = validate();
    if (!parsed) return;
    onSave({ ...parsed, file });
  };

  const handleUpdate = async () => {
    const parsed = validate();
    if (!parsed) return;
    onSave({ ...parsed, file });
  };

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
            <button
              type="button"
              onClick={loading ? undefined : closeModal}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5">
            {/* Form card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-2">
                  <InputField
                    label="Numero de contrato o cite"
                    type="text"
                    name="n_contrato_cite"
                    value={form?.n_contrato_cite || ''}
                    onChange={updateBase}
                    error={error.n_contrato_cite}
                  />
                </div>

                <div className="md:col-span-3">
                  <InputField
                    label="Area del contrato"
                    name="area_contrato"
                    type="text"
                    value={form?.area_contrato || ''}
                    onChange={updateBase}
                    error={error.area_contrato}
                  />
                </div>

                <div className="md:col-span-6">
                  <InputField
                    label="Empresa"
                    name="empresa"
                    type="text"
                    value={form?.empresa || ''}
                    onChange={updateBase}
                    error={error.empresa}
                  />
                </div>

                <div className="md:col-span-6">
                  <InputField
                    label="Proveedor"
                    name="proveedor"
                    type="text"
                    value={form?.proveedor || ''}
                    onChange={updateBase}
                    error={error.proveedor}
                  />
                </div>
                <div className="md:col-span-3">
                  <InputField
                    label="Objeto"
                    name="objeto"
                    type="text"
                    value={form?.objeto || ''}
                    onChange={updateBase}
                    error={error.objeto}
                  />
                </div>
                <div className="md:col-span-3">
                  <InputField
                    label="Monto del contrato"
                    name="monto_contrato"
                    type="number"
                    value={form?.monto_contrato || ''}
                    onChange={updateBase}
                    error={error.monto_contrato}
                  />
                </div>
                <div className="md:col-span-3">
                  <InputField
                    label="Fecha de inicio"
                    name="fecha_inicio"
                    type="date"
                    value={form?.fecha_inicio || ''}
                    onChange={updateBase}
                    error={error.fecha_inicio}
                  />
                </div>
                <div className="md:col-span-3">
                  <InputField
                    label="Finalizacon de contrato"
                    name="finalizacion_contrato"
                    type="date"
                    value={form?.finalizacion_contrato || ''}
                    onChange={updateBase}
                    error={error.finalizacion_contrato}
                  />
                </div>

                {/* Upload */}
                <div className="md:col-span-12">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    {file ? 'Cambiar PDF' : 'Subir PDF'}
                    <input
                      hidden
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </label>

                  {file && (
                    <p className="mt-2 text-sm text-slate-600">
                      Archivo seleccionado: <strong>{file.name}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-900">
                Vista previa del documento
              </p>

              {isEditing ? (
                previewUrl ? (
                  <div className="h-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <iframe
                      src={previewUrl}
                      title="Vista previa PDF"
                      className="h-full w-full border-0"
                    />
                  </div>
                ) : (
                  // si editas y no seleccionaste nuevo, muestra el PDF del server
                  <PdfPreviewTW
                    documentoId={id}
                    getDocument={getDocumentsView}
                  />
                )
              ) : previewUrl ? (
                <div className="h-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <iframe
                    src={previewUrl}
                    title="Vista previa PDF"
                    className="h-full w-full border-0"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 text-center">
                  <p className="text-sm text-slate-600">
                    Aún no has seleccionado ningún PDF. Usa{' '}
                    <strong>“Subir PDF”</strong> para adjuntar un documento.
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

              {isEditing ? (
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={loading}
                  className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Actualizar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={loading}
                  className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Guardar
                </button>
              )}
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
