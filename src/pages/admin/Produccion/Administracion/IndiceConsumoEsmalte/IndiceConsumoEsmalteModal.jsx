import { useState, useEffect } from 'react';
import { DatosMetaEsmalte } from '@schema/Produccion/Administracion/IndiceConsumoEsmalte.schema';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';
const initialForm = () => ({
  meta_gr_m: '',
  meta: '',
});

export default function IndiceConsumoEsmalteModal({
  open,
  onClose,
  onSave,
  fetchById,
}) {
  const [form, setForm] = useState();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return; // evita correr si no aplica
    try {
      setLoading(true);
      setForm(initialForm());
      setError({});
      setLoading(false);
    } catch (e) {
      toast.error(e.message || 'Error en la modal');
    } finally {
      setLoading(false);
    }
  }, [open, fetchById]);

  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleValidation = async () => {
    const result = DatosMetaEsmalte.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    } else {
      const data = result.data;

      handleSave(data);
    }
  };
  const handleSave = (payload) => {
    onSave(payload);
  };

  const handleClose = () => {
    setError([]);
    setForm(initialForm());
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay (fondo) */}
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className="relative z-10 w-3xl max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
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
                Indice consumo esmalte
              </h3>
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Meta [gr/m]"
                    type="number"
                    name="meta_gr_m"
                    value={form?.meta_gr_m || ''}
                    onChange={updateBase}
                    error={error.meta_gr_m}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Meta"
                    type="number"
                    name="meta"
                    value={form?.meta || ''}
                    onChange={updateBase}
                    error={error.meta}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5">
              <button
                className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                onClick={handleValidation}
              >
                Guardar cambios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
