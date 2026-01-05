import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';

//
import ConfirmModal from '@components/ConfirmModal';
import InputField from '@components/InputField';
import Select from '@components/Select';
//
import { DatosHorasExtra } from '@schema/Administracion/HorasExtra.schema';
//
import { registerObj } from '@service/Administracion/HorasExtra.services';

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
    const result = DatosHorasExtra.safeParse(form);
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
              label="seg_ind"
              type="number"
              name="seg_ind"
              value={form?.seg_ind || ''}
              onChange={updateBase}
              error={error.seg_ind}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="r_centro"
              type="number"
              name="r_centro"
              value={form?.r_centro || ''}
              onChange={updateBase}
              error={error.r_centro}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="r_oeste"
              type="number"
              name="r_oeste"
              value={form?.r_oeste || ''}
              onChange={updateBase}
              error={error.r_oeste}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="r_este"
              type="number"
              name="r_este"
              value={form?.r_este || ''}
              onChange={updateBase}
              error={error.r_este}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="r_fabr"
              type="number"
              name="r_fabr"
              value={form?.r_fabr || ''}
              onChange={updateBase}
              error={error.r_fabr}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="total_personas"
              type="number"
              name="total_personas"
              value={form?.total_personas || ''}
              onChange={updateBase}
              error={error.total_personas}
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
