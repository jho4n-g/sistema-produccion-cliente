import { useState, useEffect } from 'react';
import { DatosGeneracionResidiosSolidos } from '../../../../schema/Administracion/GeneracionResiduosSolidos.schema';
import InputField from '../../../../components/InputField';
import { toast } from 'react-toastify';

const initialForm = () => ({
  periodo: '',
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
  indice_horas_extras: '',
  meta: '',
});

export default function GeneracionResiduosModal({
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
    const result = DatosGeneracionResidiosSolidos.safeParse(form);
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
                    label="N° trabajadores"
                    type="number"
                    name="n_trabajadores"
                    value={form?.n_trabajadores || ''}
                    onChange={updateBase}
                    error={error.n_trabajadores}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg carton"
                    type="number"
                    name="kg_carton"
                    value={form?.kg_carton || ''}
                    onChange={updateBase}
                    error={error.kg_carton}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Pe"
                    type="number"
                    name="pe"
                    value={form?.pe || ''}
                    onChange={updateBase}
                    error={error.pe}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg strechfilm"
                    type="number"
                    name="kg_strechfilm"
                    value={form?.kg_strechfilm || ''}
                    onChange={updateBase}
                    error={error.kg_strechfilm}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg bolsas bigbag"
                    type="number"
                    name="kg_bolsas_bigbag"
                    value={form?.kg_bolsas_bigbag || ''}
                    onChange={updateBase}
                    error={error.kg_bolsas_bigbag}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg turriles plasticos"
                    type="number"
                    name="kg_turriles_plasticos"
                    value={form?.kg_turriles_plasticos || ''}
                    onChange={updateBase}
                    error={error.kg_turriles_plasticos}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg envase mil litros"
                    type="number"
                    name="kg_envase_mil_litros"
                    value={form?.kg_envase_mil_litros || ''}
                    onChange={updateBase}
                    error={error.kg_envase_mil_litros}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg sunchu"
                    type="number"
                    name="sunchu_kg"
                    value={form?.sunchu_kg || ''}
                    onChange={updateBase}
                    error={error.sunchu_kg}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg madera"
                    type="number"
                    name="kg_madera"
                    value={form?.kg_madera || ''}
                    onChange={updateBase}
                    error={error.kg_madera}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg bidon azul"
                    type="number"
                    name="kg_bidon_azul"
                    value={form?.kg_bidon_azul || ''}
                    onChange={updateBase}
                    error={error.kg_bidon_azul}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg aceite sucio"
                    type="number"
                    name="kg_aceite_sucio"
                    value={form?.kg_aceite_sucio || ''}
                    onChange={updateBase}
                    error={error.kg_aceite_sucio}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg bolsas plasticas transparentes"
                    type="number"
                    name="kg_bolsas_plasticas_transparentes"
                    value={form?.kg_bolsas_plasticas_transparentes || ''}
                    onChange={updateBase}
                    error={error.kg_bolsas_plasticas_transparentes}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Kg bolsas yute"
                    type="number"
                    name="kg_bolsas_yute"
                    value={form?.kg_bolsas_yute || ''}
                    onChange={updateBase}
                    error={error.kg_bolsas_yute}
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
