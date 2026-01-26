import { useState, useEffect } from 'react';
import { DatosCalidad } from '@schema/Produccion/Administracion/Calidad.schema';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';

const initialForm = () => ({
  fecha: '',
  produccion_mensual: '',
  presupuesto: '',
  produccion_primera_mensual: '',
  produccion_segunda_mensual: '',
  produccion_tercera_mensual: '',
  produccion_cascote_mensual: '',
});

export default function CalidadModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  isEdit = false,
}) {
  const [form, setForm] = useState();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !id) return; // evita correr si no aplica

    let active = true; // evita setState tras unmount
    setLoading(true);

    // CREAR
    if (!isEdit) {
      setForm(initialForm());
      setError({});
      setLoading(false);
      return () => {
        active = false;
      };
    }

    // EDITAR
    if (!id) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

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
  }, [open, id, fetchById, isEdit]);

  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleValidation = async () => {
    const result = DatosCalidad.safeParse(form);
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
    setError({});
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
              <h3 className="text-lg font-semibold text-slate-900">Calidad</h3>
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Fila 1 */}
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={form?.fecha || ''}
                    onChange={updateBase}
                    error={error.fecha}
                  />
                </div>

                {/* Fila 2 */}
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Produccion mensual"
                    type="number"
                    name="produccion_mensual"
                    value={form?.produccion_mensual || ''}
                    onChange={updateBase}
                    error={error.produccion_mensual}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Presupuesto"
                    type="number"
                    name="presupuesto"
                    value={form?.presupuesto || ''}
                    onChange={updateBase}
                    error={error.presupuesto}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Produccion primera mensual"
                    type="number"
                    name="produccion_primera_mensual"
                    value={form?.produccion_primera_mensual || ''}
                    onChange={updateBase}
                    error={error.produccion_primera_mensual}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Produccion segunda mensual"
                    type="number"
                    name="produccion_segunda_mensual"
                    value={form?.produccion_segunda_mensual || ''}
                    onChange={updateBase}
                    error={error.produccion_segunda_mensual}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Produccion tercera mensual"
                    type="number"
                    name="produccion_tercera_mensual"
                    value={form?.produccion_tercera_mensual || ''}
                    onChange={updateBase}
                    error={error.produccion_tercera_mensual}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Produccion cascote mensual"
                    type="number"
                    name="produccion_cascote_mensual"
                    value={form?.produccion_cascote_mensual || ''}
                    onChange={updateBase}
                    error={error.produccion_cascote_mensual}
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
                {isEdit ? 'Guardar cambios' : 'Guardar registro'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
