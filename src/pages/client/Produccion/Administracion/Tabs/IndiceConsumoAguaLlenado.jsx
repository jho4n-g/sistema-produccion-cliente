import { useState } from 'react';

import { toast } from 'react-toastify';

//
import ConfirmModal from '@components/ConfirmModal';
import InputField from '@components/InputField';

//
import { DatosIndiceConsumoAgua } from '@schema/Produccion/Administracion/IndiceConsumoAgua.schema';
//
import { registerObj } from '@service/Produccion/Administracion/IndiceConsumoAgua.services';

const initialForm = () => ({
  periodo: '',
  produccion: '',
  consumo_agua: '',
  cisterna_agua: '',
  medidor_subestacion_ee: '',
  medidor_tres_produccion: '',
  medidor_cuatro_eliza: '',
  medidor_cinco_administracion: '',
  medidor_seis_arcilla: '',
  meta: '',
});

export default function IndiceConsumoAguaLlenado() {
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
    const result = DatosIndiceConsumoAgua.safeParse(form);
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
        <h3 className="text-lg font-semibold text-slate-900">
          Indice consumo agua
        </h3>
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

          {/* Fila 2 */}
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Produccion"
              type="text"
              name="produccion"
              value={form?.produccion || ''}
              onChange={updateBase}
              error={error.produccion}
            />
          </div>

          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Consumo agua"
              type="text"
              name="consumo_agua"
              value={form?.consumo_agua || ''}
              onChange={updateBase}
              error={error.consumo_agua}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Cisterna agua"
              type="text"
              name="cisterna_agua"
              value={form?.cisterna_agua || ''}
              onChange={updateBase}
              error={error.cisterna_agua}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Medidor subestacion ee"
              type="number"
              name="medidor_subestacion_ee"
              value={form?.medidor_subestacion_ee || ''}
              onChange={updateBase}
              error={error.medidor_subestacion_ee}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Medidor tres produccion"
              type="number"
              name="medidor_tres_produccion"
              value={form?.medidor_tres_produccion || ''}
              onChange={updateBase}
              error={error.medidor_tres_produccion}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Medidor cuatro eliza"
              type="number"
              name="medidor_cuatro_eliza"
              value={form?.medidor_cuatro_eliza || ''}
              onChange={updateBase}
              error={error.medidor_cuatro_eliza}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Medidor cinco administracion"
              type="number"
              name="medidor_cinco_administracion"
              value={form?.medidor_cinco_administracion || ''}
              onChange={updateBase}
              error={error.medidor_cinco_administracion}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Medidor seis arcilla"
              type="number"
              name="medidor_seis_arcilla"
              value={form?.medidor_seis_arcilla || ''}
              onChange={updateBase}
              error={error.medidor_seis_arcilla}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Meta"
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
