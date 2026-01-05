import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';

//
import ConfirmModal from '@components/ConfirmModal';
import InputField from '@components/InputField';
import Select from '@components/Select';
//
import { DatosGeneracionResidiosSolidos } from '@schema/Administracion/GeneracionResiduosSolidos.schema';
//
import { registerObj } from '@service/Administracion/GeneracionResiduos.services';

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

export default function CalidadLlenado() {
  const [form, setForm] = useState(initialForm());
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({});

  const [dataSave, setDataSave] = useState(null);

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
      setDataSave(data);
      setOpenModalConfirm(true);
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await registerObj(dataSave);
      if (res.ok) {
        toast.success(res.message || 'Se guardo exitosamente');
        setOpenModalConfirm(false);
        setForm(initialForm());
      }
      if (!res.ok) {
        toast.error(res.message || 'No se puedo guardar los datos');
        setOpenModalConfirm(false);
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <div className="md:col-span-1 lg:col-span-2">
            <button
              className="rounded-xl w-full h-full bg-green-800 px-3 py-2 text-white hover:bg-green-900"
              onClick={handleValidation}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={openModalConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenModalConfirm(false)}
        onConfirm={handleSave}
      />
    </>
  );
}
