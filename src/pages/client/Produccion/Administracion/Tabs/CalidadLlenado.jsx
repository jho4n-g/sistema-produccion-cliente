import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';

//
import ConfirmModal from '@components/ConfirmModal';
import InputField from '@components/InputField';
import Select from '@components/Select';
//
import { DatosCalidad } from '@schema/Produccion/Administracion/Calidad.schema';
//
import { registerObj } from '@service/Produccion/Administracion/Calidad.services';

const initialForm = () => ({
  fecha: '',
  produccion_mensual: '',
  presupuesto: '',
  produccion_primera_mensual: '',
  produccion_segunda_mensual: '',
  produccion_tercera_mensual: '',
  produccion_cascote_mensual: '',
  meta_primera_calidad: '',
  meta_cascote_calidad: '',
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
    const result = DatosCalidad.safeParse(form);
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

            {/* Fila 2 */}
            <div className="md:col-span-1 lg:col-span-6">
              <InputField
                label="Produccion mensual"
                type="text"
                name="produccion_mensual"
                value={form?.produccion_mensual || ''}
                onChange={updateBase}
                error={error.produccion_mensual}
              />
            </div>

            <div className="md:col-span-1 lg:col-span-6">
              <InputField
                label="Presupuesto"
                type="text"
                name="presupuesto"
                value={form?.presupuesto || ''}
                onChange={updateBase}
                error={error.presupuesto}
              />
            </div>
            <div className="md:col-span-1 lg:col-span-6">
              <InputField
                label="Produccion primera mensual"
                type="text"
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
            <div className="md:col-span-1 lg:col-span-6">
              <InputField
                label="Meta primera calidad"
                type="number"
                name="meta_primera_calidad"
                value={form?.meta_primera_calidad || ''}
                onChange={updateBase}
                error={error.meta_primera_calidad}
              />
            </div>
            <div className="md:col-span-1 lg:col-span-6">
              <InputField
                label="Meta cascote calidad"
                type="number"
                name="meta_cascote_calidad"
                value={form?.meta_cascote_calidad || ''}
                onChange={updateBase}
                error={error.meta_cascote_calidad}
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
