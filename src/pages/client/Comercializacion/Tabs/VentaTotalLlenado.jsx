import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';

//
import ConfirmModal from '@components/ConfirmModal';
import InputField from '@components/InputField';
import Select from '@components/Select';
//
import { DatosVentaTotal } from '@schema/Comercializacion/VentaTotal.Schema';
//
import { registerObj } from '@service/Comercializacion/VentaTotal.services';

const initialForm = () => ({
  periodo: '',
  presupuesto_mensual: '',
  venta_mensual: '',
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
    const result = DatosVentaTotal.safeParse(form);
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
              label="Venta mensual"
              type="number"
              name="venta_mensual"
              value={form?.venta_mensual || ''}
              onChange={updateBase}
              error={error.venta_mensual}
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
