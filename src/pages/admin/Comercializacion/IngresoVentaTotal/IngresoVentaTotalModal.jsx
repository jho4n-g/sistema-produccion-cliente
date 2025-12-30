import { useState, useEffect } from 'react';
import { DatosIngresoPorVentaTotal } from '../../../../schema/Comercializacion/IngresoPorVentaTotal.Schema';
import InputField from '../../../../components/InputField';
import { toast } from 'react-toastify';

export default function IngresoVentaTotalModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
}) {
  const [form, setForm] = useState();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

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

  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleValidation = async () => {
    const result = DatosIngresoPorVentaTotal.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    } else {
      const data = result.data;
      onSave(data);
    }
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
                    label="Periodo"
                    type="month"
                    name="periodo"
                    value={form?.periodo || ''}
                    onChange={updateBase}
                    error={error.periodo}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Presupuesto mensual"
                    type="number"
                    name="presupuesto_mensual"
                    value={form?.presupuesto_mensual || ''}
                    onChange={updateBase}
                    error={error.presupuesto_mensual}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Venta mensual con otro ingresos"
                    type="number"
                    name="venta_mensual_con_otro_ingresos"
                    value={form?.venta_mensual_con_otro_ingresos || ''}
                    onChange={updateBase}
                    error={error.venta_mensual_con_otro_ingresos}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Venta mensual ceramica"
                    type="number"
                    name="venta_mensual_ceramica"
                    value={form?.venta_mensual_ceramica || ''}
                    onChange={updateBase}
                    error={error.venta_mensual_ceramica}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Otros ingresos"
                    type="number"
                    name="otros_ingresos"
                    value={form?.otros_ingresos || ''}
                    onChange={updateBase}
                    error={error.otros_ingresos}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="meta"
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
                onClick={onClose}
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
