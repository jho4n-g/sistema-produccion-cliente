import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

import InputField from '@components/InputField';

// services + schema (igual que tu MUI)
import { RecibidoExternoSchema } from '@schema/secretaria/DocumentoRecibidoExterno.schema.js';
import CheckboxField from '@components/CheckboxField';

const initialForm = () => ({
  entregado_por: '',
  fecha_entregado: '',
  documento: '',
  enviado_por: '',
  descripcion: '',
  entragado_a: '',
  dev: '',
  fecha_devolucion: '',
  derivado_a: '',
});

export default function CorrespondenciaRecibidaModal({
  open,
  onClose,
  fetchById,
  isEditing = false,
  onSave,
  id,
}) {
  const [form, setForm] = useState(null);

  const [error, setError] = useState({});

  const [loading, setLoading] = useState(false);

  const title = isEditing ? 'Edición del documento' : 'Nuevo documento';

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  useEffect(() => {
    if (!open || !id) return; // evita correr si no aplica

    let active = true; // evita setState tras unmount
    setLoading(true);

    (async () => {
      try {
        const data = await fetchById(id); // ← ahora sí esperamos aquí

        if (!active) return;
        console.log(data);
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

  const closeModal = () => {
    setForm(initialForm());

    setError({});
    onClose();
  };

  const validate = () => {
    const result = RecibidoExternoSchema.safeParse(form);
    if (!result.success) {
      console.log(result.error.flatten().fieldErrors);
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return null;
    }

    return result.data;
  };

  const handleCreate = async () => {
    const parsed = validate();
    if (!parsed) return;
    onSave(parsed);
  };

  const handleUpdate = async () => {
    const parsed = validate();
    if (!parsed) return;
    onSave(parsed);
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
                    label="Fecha entregado"
                    type="date"
                    name="fecha_entregado"
                    value={form?.fecha_entregado || ''}
                    onChange={updateBase}
                    error={error.fecha_entregado}
                  />
                </div>
                <div className="md:col-span-2">
                  <InputField
                    label="Fecha devolucion"
                    name="fecha_devolucion"
                    type="date"
                    value={form?.fecha_devolucion || ''}
                    onChange={updateBase}
                    error={error.fecha_devolucion}
                  />
                </div>
                <div className="md:col-span-6">
                  <InputField
                    label="Entregado por"
                    name="entregado_por"
                    type="text"
                    value={form?.entregado_por || ''}
                    onChange={updateBase}
                    error={error.entregado_por}
                  />
                </div>
                <div className="md:col-span-6">
                  <InputField
                    label="Documento"
                    name="documento"
                    type="text"
                    value={form?.documento || ''}
                    onChange={updateBase}
                    error={error.documento}
                  />
                </div>
                <div className="md:col-span-6">
                  <InputField
                    label="Enviado por"
                    name="enviado_por"
                    type="text"
                    value={form?.enviado_por || ''}
                    onChange={updateBase}
                    error={error.enviado_por}
                  />
                </div>

                <div className="md:col-span-6">
                  <InputField
                    label="Descripcion"
                    name="descripcion"
                    type="text"
                    value={form?.descripcion || ''}
                    onChange={updateBase}
                    error={error.descripcion}
                  />
                </div>
                <div className="md:col-span-6">
                  <InputField
                    label="Entragado a"
                    name="entragado_a"
                    type="text"
                    value={form?.entragado_a || ''}
                    onChange={updateBase}
                    error={error.entragado_a}
                  />
                </div>

                <div className="md:col-span-6">
                  <InputField
                    label="Devolucion"
                    name="dev"
                    type="text"
                    value={form?.dev || ''}
                    onChange={updateBase}
                    error={error.dev}
                  />
                </div>

                <div className="md:col-span-6">
                  <InputField
                    label="Derivado a"
                    name="derivado_a"
                    type="text"
                    value={form?.derivado_a || ''}
                    onChange={updateBase}
                    error={error.derivado_a}
                  />
                </div>
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
