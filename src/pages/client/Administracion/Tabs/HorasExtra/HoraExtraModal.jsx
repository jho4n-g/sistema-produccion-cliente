import { useState, useEffect } from 'react';
import { DatosHorasExtra } from '@schema/Administracion/HorasExtra.schema';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';

const initialForm = () => ({
  fecha: '',
  adm: '',
  prd: '',
  mantto: '',
  ampliacion: '',
  cc: '',
  seg_ind: '',
  r_centro: '',
  r_oeste: '',
  r_este: '',
  r_fabr: '',
  total_personas: '',
});
export default function HorasExtraModal({
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
    const result = DatosHorasExtra.safeParse(form);
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
              <h3 className="text-lg font-semibold text-slate-900">
                Hoas extra
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

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Adm"
                    type="number"
                    name="adm"
                    value={form?.adm || ''}
                    onChange={updateBase}
                    error={error.adm}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Prd"
                    type="number"
                    name="prd"
                    value={form?.prd || ''}
                    onChange={updateBase}
                    error={error.prd}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Mantto"
                    type="number"
                    name="mantto"
                    value={form?.mantto || ''}
                    onChange={updateBase}
                    error={error.mantto}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Ampliacion"
                    type="number"
                    name="ampliacion"
                    value={form?.ampliacion || ''}
                    onChange={updateBase}
                    error={error.ampliacion}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Cc"
                    type="number"
                    name="cc"
                    value={form?.cc || ''}
                    onChange={updateBase}
                    error={error.cc}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Seg ind"
                    type="number"
                    name="seg_ind"
                    value={form?.seg_ind || ''}
                    onChange={updateBase}
                    error={error.seg_ind}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="R centro"
                    type="number"
                    name="r_centro"
                    value={form?.r_centro || ''}
                    onChange={updateBase}
                    error={error.r_centro}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="R oeste"
                    type="number"
                    name="r_oeste"
                    value={form?.r_oeste || ''}
                    onChange={updateBase}
                    error={error.r_oeste}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="R este"
                    type="number"
                    name="r_este"
                    value={form?.r_este || ''}
                    onChange={updateBase}
                    error={error.r_este}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="R fabr"
                    type="number"
                    name="r_fabr"
                    value={form?.r_fabr || ''}
                    onChange={updateBase}
                    error={error.r_fabr}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Total personas"
                    type="number"
                    name="total_personas"
                    value={form?.total_personas || ''}
                    onChange={updateBase}
                    error={error.total_personas}
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
