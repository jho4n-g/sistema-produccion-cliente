import { useState, useEffect } from 'react';
import { DatosProductoNoConforme } from '../../../../../schema/Produccion/Administracion/ProductoNoConforme.schema';
import InputField from '../../../../../components/InputField';
import { toast } from 'react-toastify';

const initialForm = () => ({
  fecha: '',
  producto: '',
  no_conformidad_descripcion: '',
  desvios_cajas: '',
  cantidad_rechazado_cajas: '',
  cantidad_recuperada_extra_a: '',
  cantidad_recuperada_extra_b: '',
  cantidad_recuperada_extra_c: '',
  cantidad_recuperada_extra_d: '',
  cantidad_recuperada_extra_dd: '',
  cantidad_recuperada_calibre_c1_cajas: '',
  cantidad_recuperada_calibre_c2c4_cajas: '',
  cantidad_recuperada_calibre_c3_cajas: '',
  standard: '',
  oferta: '',
  casco: '',
  estado: '',
  observacion: '',
});

export default function ProductoNoConformeModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  isEdit = false,
}) {
  const [form, setForm] = useState(initialForm());
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
        const data = await fetchById(id);

        if (!active) return;

        if (data?.ok) {
          setForm(data.dato ?? {});
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
  }, [open, id, fetchById, isEdit]);

  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleValidation = async () => {
    const result = DatosProductoNoConforme.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      console.log(fieldErrors);
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
                Producto no conforme
              </h3>
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="fecha"
                    type="date"
                    name="fecha"
                    value={form?.fecha || ''}
                    onChange={updateBase}
                    error={error.fecha}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Producto"
                    type="text"
                    name="producto"
                    value={form?.producto || ''}
                    onChange={updateBase}
                    error={error.producto}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-12">
                  <InputField
                    label="No conformidad (Descripcion)"
                    type="text"
                    name="no_conformidad_descripcion"
                    value={form?.no_conformidad_descripcion || ''}
                    onChange={updateBase}
                    error={error.no_conformidad_descripcion}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Desvios"
                    type="number"
                    name="desvios_cajas"
                    value={form?.desvios_cajas || ''}
                    onChange={updateBase}
                    error={error.desvios_cajas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad rechazado"
                    type="number"
                    name="cantidad_rechazado_cajas"
                    value={form?.cantidad_rechazado_cajas || ''}
                    onChange={updateBase}
                    error={error.cantidad_rechazado_cajas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad recuperado/ extra/ a"
                    type="number"
                    name="cantidad_recuperada_extra_a"
                    value={form?.cantidad_recuperada_extra_a || ''}
                    onChange={updateBase}
                    error={error.cantidad_recuperada_extra_a}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad recuperado/ extra/  b"
                    type="number"
                    name="cantidad_recuperada_extra_b"
                    value={form?.cantidad_recuperada_extra_b || ''}
                    onChange={updateBase}
                    error={error.cantidad_recuperada_extra_b}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad recuperado/ extra/  c"
                    type="number"
                    name="cantidad_recuperada_extra_c"
                    value={form?.cantidad_recuperada_extra_c || ''}
                    onChange={updateBase}
                    error={error.cantidad_recuperada_extra_c}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad recuperado/ extra/  d"
                    type="number"
                    name="cantidad_recuperada_extra_d"
                    value={form?.cantidad_recuperada_extra_d || ''}
                    onChange={updateBase}
                    error={error.cantidad_recuperada_extra_d}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad recuperado/ extra/  dd"
                    type="number"
                    name="cantidad_recuperada_extra_dd"
                    value={form?.cantidad_recuperada_extra_dd || ''}
                    onChange={updateBase}
                    error={error.cantidad_recuperada_extra_dd}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad recuperado/ calibre/  c1"
                    type="number"
                    name="cantidad_recuperada_calibre_c1_cajas"
                    value={form?.cantidad_recuperada_calibre_c1_cajas || ''}
                    onChange={updateBase}
                    error={error.cantidad_recuperada_calibre_c1_cajas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad recuperado/ calibre/  c2/c4"
                    type="number"
                    name="cantidad_recuperada_calibre_c2c4_cajas"
                    value={form?.cantidad_recuperada_calibre_c2c4_cajas || ''}
                    onChange={updateBase}
                    error={error.cantidad_recuperada_calibre_c2c4_cajas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cantidad recuperado/ calibre/  c3"
                    type="number"
                    name="cantidad_recuperada_calibre_c3_cajas"
                    value={form?.cantidad_recuperada_calibre_c3_cajas || ''}
                    onChange={updateBase}
                    error={error.cantidad_recuperada_calibre_c3_cajas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Standard"
                    type="number"
                    name="standard"
                    value={form?.standard || ''}
                    onChange={updateBase}
                    error={error.standard}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Oferta"
                    type="number"
                    name="oferta"
                    value={form?.oferta || ''}
                    onChange={updateBase}
                    error={error.oferta}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Casco"
                    type="number"
                    name="casco"
                    value={form?.casco || ''}
                    onChange={updateBase}
                    error={error.casco}
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
                <div className="md:col-span-1 lg:col-span-12">
                  <InputField
                    label="Observacion"
                    type="text"
                    name="observacion"
                    value={form?.observacion || ''}
                    onChange={updateBase}
                    error={error.observacion}
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
