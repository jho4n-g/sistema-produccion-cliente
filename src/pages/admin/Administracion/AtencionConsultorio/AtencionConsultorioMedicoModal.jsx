import { useState, useEffect } from 'react';
import { DatosAtencionConsultorio } from '@schema/Administracion/AtencionConsultorio.Schema';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';

const initialForm = () => ({
  fecha: '',
  prestacion_medica_alergias: '',
  prestacion_medica_cardiovasculares: '',
  desvios_prestacion_medica_cefaleascajas: '',
  prestacion_medica_oftamologicas: '',
  prestacion_medica_oticas: '',
  prestacion_medica_respiratorias: '',
  prestacion_medica_digestivas: '',
  prestacion_medica_genitourinarias: '',
  prestacion_medica_musculo_esqueleticas: '',
  prestacion_medica_odontologia: '',
  prestacion_medica_quemaduras: '',
  prestacion_medica_piel_anexos: '',
  prestacion_medica_otros: '',
  prestacion_medica_curaciones: '',
  prestacion_medica_inyectables: '',
  total_consultas: '',
  control_pa: '',
  glicemia_capilar: '',
  riesgo_prof: '',
  riesto_comun: '',
});

export default function AtencionConsultorioMedicoModal({
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
    const result = DatosAtencionConsultorio.safeParse(form);
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
        className="relative z-10 w-[92%] max-w-8xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
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
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="fecha"
                    type="date"
                    name="fecha"
                    value={form?.fecha || ''}
                    onChange={updateBase}
                    error={error.fecha}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6"></div>
                <div className="md:col-span-1 lg:col-span-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    PRESTACIONES MEDICAS
                  </h3>
                </div>{' '}
                <div className="md:col-span-1 lg:col-span-6"></div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Alergias"
                    type="text"
                    name="prestacion_medica_alergias"
                    value={form?.prestacion_medica_alergias || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_alergias}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Cardiovasculares"
                    type="text"
                    name="prestacion_medica_cardiovasculares"
                    value={form?.prestacion_medica_cardiovasculares || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_cardiovasculares}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Cefaleas"
                    type="number"
                    name="prestacion_medica_cefaleas"
                    value={form?.prestacion_medica_cefaleas || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_cefaleas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Oftamologicas"
                    type="number"
                    name="prestacion_medica_oftamologicas"
                    value={form?.prestacion_medica_oftamologicas || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_oftamologicas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Oticas"
                    type="number"
                    name="prestacion_medica_oticas"
                    value={form?.prestacion_medica_oticas || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_oticas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Respiratorias"
                    type="number"
                    name="prestacion_medica_respiratorias"
                    value={form?.prestacion_medica_respiratorias || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_respiratorias}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Digestivasc"
                    type="number"
                    name="prestacion_medica_digestivas"
                    value={form?.prestacion_medica_digestivas || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_digestivas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Genitourinarias"
                    type="number"
                    name="prestacion_medica_genitourinarias"
                    value={form?.prestacion_medica_genitourinarias || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_genitourinarias}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Musculo esqueleticas"
                    type="number"
                    name="prestacion_medica_musculo_esqueleticas"
                    value={form?.prestacion_medica_musculo_esqueleticas || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_musculo_esqueleticas}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Odontologia"
                    type="number"
                    name="prestacion_medica_odontologia"
                    value={form?.prestacion_medica_odontologia || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_odontologia}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Quemaduras"
                    type="number"
                    name="prestacion_medica_quemaduras"
                    value={form?.prestacion_medica_quemaduras || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_quemaduras}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Piel anexos"
                    type="number"
                    name="prestacion_medica_piel_anexos"
                    value={form?.prestacion_medica_piel_anexos || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_piel_anexos}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Otros"
                    type="number"
                    name="prestacion_medica_otros"
                    value={form?.prestacion_medica_otros || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_otros}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Curaciones"
                    type="number"
                    name="prestacion_medica_curaciones"
                    value={form?.prestacion_medica_curaciones || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_curaciones}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Inyectables"
                    type="number"
                    name="prestacion_medica_inyectables"
                    value={form?.prestacion_medica_inyectables || ''}
                    onChange={updateBase}
                    error={error.prestacion_medica_inyectables}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-12"></div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Control P.A."
                    type="number"
                    name="control_pa"
                    value={form?.control_pa || ''}
                    onChange={updateBase}
                    error={error.control_pa}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Glicemia capilar"
                    type="text"
                    name="glicemia_capilar"
                    value={form?.glicemia_capilar || ''}
                    onChange={updateBase}
                    error={error.glicemia_capilar}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Riesgo prof."
                    type="text"
                    name="riesgo_prof"
                    value={form?.riesgo_prof || ''}
                    onChange={updateBase}
                    error={error.riesgo_prof}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Riesgo comun"
                    type="text"
                    name="riesto_comun"
                    value={form?.riesto_comun || ''}
                    onChange={updateBase}
                    error={error.riesto_comun}
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
