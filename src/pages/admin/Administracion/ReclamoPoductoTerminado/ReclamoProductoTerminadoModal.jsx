import { useState, useEffect } from 'react';
import { ReclamoProductoTerminado } from '@schema/Administracion/ReclamoProductoTerminado.Schema';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';
const initialForm = () => ({
  fecha: '',
  regional: '',
  nro: '',
  cliente: '',
  reclamo: '',
  defecto: '',
  producto: '',
  fecha_produccion: '',
  cantidad: '',
  devolucion_producto: '',
  devolucion_economica: '',
  procedente: '',
  no_procedente: '',
  estado: '',
});

export default function ReclamoProductoTerminadoModal({
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
    if (!open) {
      // al cerrar → limpiar TODO
      setForm(initialForm());
      setError({});
      setLoading(false);
      return;
    }
    // al abrir en modo crear
    if (!isEdit) {
      setForm(initialForm());
      setError({});
    }
  }, [open, isEdit]);

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
    const result = ReclamoProductoTerminado.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      console.log(fieldErrors);
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
              <h3 className="text-lg font-semibold text-slate-900">
                Reclamo producto terminado
              </h3>
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
                    label="Regional"
                    type="text"
                    name="regional"
                    value={form?.regional || ''}
                    onChange={updateBase}
                    error={error.regional}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Nro"
                    type="number"
                    name="nro"
                    value={form?.nro || ''}
                    onChange={updateBase}
                    error={error.nro}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cliente"
                    type="number"
                    name="cliente"
                    value={form?.cliente || ''}
                    onChange={updateBase}
                    error={error.cliente}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Reclamo"
                    type="number"
                    name="reclamo"
                    value={form?.reclamo || ''}
                    onChange={updateBase}
                    error={error.reclamo}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Defecto"
                    type="number"
                    name="defecto"
                    value={form?.defecto || ''}
                    onChange={updateBase}
                    error={error.defecto}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Producto"
                    type="number"
                    name="producto"
                    value={form?.producto || ''}
                    onChange={updateBase}
                    error={error.producto}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Fecha produccion"
                    type="date"
                    name="fecha_produccion"
                    value={form?.fecha_produccion || ''}
                    onChange={updateBase}
                    error={error.fecha_produccion}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad"
                    type="number"
                    name="cantidad"
                    value={form?.cantidad || ''}
                    onChange={updateBase}
                    error={error.cantidad}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Devolucion producto"
                    type="number"
                    name="devolucion_producto"
                    value={form?.devolucion_producto || ''}
                    onChange={updateBase}
                    error={error.devolucion_producto}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Devolucion economica"
                    type="number"
                    name="devolucion_economica"
                    value={form?.devolucion_economica || ''}
                    onChange={updateBase}
                    error={error.devolucion_economica}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Procedente"
                    type="number"
                    name="procedente"
                    value={form?.procedente || ''}
                    onChange={updateBase}
                    error={error.procedente}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="No procedente"
                    type="number"
                    name="no_procedente"
                    value={form?.no_procedente || ''}
                    onChange={updateBase}
                    error={error.no_procedente}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Estado"
                    type="number"
                    name="estado"
                    value={form?.estado || ''}
                    onChange={updateBase}
                    error={error.estado}
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
