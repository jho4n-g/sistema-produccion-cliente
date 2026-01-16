import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
  getIdObj,
} from '../../../../../service/Produccion/Administracion/IndiceConsumoAgua.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import IndiceConsumoAguaModal from './IndiceConsumoAguaModal';
import GraficoBarChart from '@components/GraficoBarChart';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { periodoATexto } from '../../../../../helpers/normalze.helpers';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'Produccion ',
    key: 'produccion',
  },
  {
    label: 'Consumo agua',
    key: 'consumo_agua',
  },
  {
    label: 'Cisterna agua',
    key: 'cisterna_agua',
  },
  {
    label: 'Medidor subestacion ee',
    key: 'medidor_subestacion_ee',
  },
  {
    label: 'Medidor tres produccion',
    key: 'medidor_tres_produccion',
  },
  {
    label: 'Medidor cuatro eliza',
    key: 'medidor_cuatro_eliza',
  },
  //*********** */
  {
    label: 'Medidor cinco administracion',
    key: 'medidor_cinco_administracion',
  },
  {
    label: 'Medidor seis arcilla',
    key: 'medidor_seis_arcilla',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
];

export default function Calidad() {
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payload, setPayload] = useState(null);
  const [datosGrafico, setDatosGrafica] = useState(null);

  const hanldeOpenConfirmDelete = (id) => {
    setIdRow(id);
    setOpenDelete(true);
  };
  const hanldeDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteObj(idRow);
      if (res.ok) {
        toast.success('Registro eliminado con éxito');
        closeDelete();
        tableRef.current?.reload();
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al eliminar el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Problemos en el servidor');
    } finally {
      setLoading(false);
    }
  };
  const closeDelete = () => {
    setOpenDelete(false);
    setIdRow(null);
  };

  const hanldeEdit = (id) => {
    setIdRow(id);
    setOpenModal(true);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayload(data);
    setOpenModalUpdate(true);
  };
  const handleCloseConfirmUpdate = () => {
    setIdRow(null);
    setPayload(null);
    setOpenModalUpdate(false);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await updateObj(idRow, payload);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setOpenModalUpdate(false);
        tableRef.current?.reload();
        setOpenModal(false);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al actualizar el registro12');
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar el registro');
    } finally {
      setLoading(false);
    }
  };
  const series = [
    { name: 'Medido # 4', data: datosGrafico?.medidor_cuatro },
    { name: 'Medido # 5', data: datosGrafico?.medidor_cinco },
    { name: 'Medido # 6', data: datosGrafico?.medidor_seis },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getAllObj}
        titulo="Produccion/ Administracion/ Indice cosumo agua"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={() => {}}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Consumo de agua por medido M3"
          categories={datosGrafico?.categories}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <ConfirmModal
        open={openModalDelete}
        title="Eliminar registro"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
        danger
        onClose={closeDelete}
        onConfirm={hanldeDelete}
      />

      <IndiceConsumoAguaModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdObj}
        id={idRow}
      />
      <ConfirmModal
        open={openModalUpdate}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={handleCloseConfirmUpdate}
        onConfirm={handleSave}
      />
    </>
  );
}
