import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
  getIdObj,
} from '../../../../../service/Produccion/Administracion/Calidad.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import GraficoBarChart from '@components/GraficoBarChart';
import CalidadModal from './CalidadModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Periodo', key: 'periodo' },
  {
    label: 'Produccion mensual',
    key: 'produccion_mensual',
  },
  {
    label: 'Presupuesto',
    key: 'presupuesto',
  },
  {
    label: 'Produccion primera mensual',
    key: 'produccion_primera_mensual',
  },
  {
    label: 'Produccion segunda mensual',
    key: 'produccion_segunda_mensual',
  },
  {
    label: 'Produccion tercera mensual',
    key: 'produccion_tercera_mensual',
  },
  //*********** */
  {
    label: 'Primera calidad porcentaje',
    key: 'primera_calidad_porcentaje',
  },
  {
    label: 'Segunda calidad porcentaje',
    key: 'segunda_calidad_porcentaje',
  },
  {
    label: 'Tercera calidad porcentaje',
    key: 'tercera_calidad_porcentaje',
  },
  {
    label: 'Cascote porcentaje',
    key: 'cascote_porcentaje',
  },

  //********** */
  {
    label: 'Primera acumulada',
    key: 'primera_acumulada',
  },
  {
    label: 'Cascote acumulada',
    key: 'cascote_acumulada',
  },
  {
    label: 'Primera acumulado procentaje',
    key: 'primera_acumulado_procentaje',
  },
  {
    label: 'Cascote acumulado procentaje',
    key: 'cascote_acumulado_procentaje',
  },
  //******++ */
  {
    label: 'Meta primera calidad',
    key: 'meta_primera_calidad',
  },
  {
    label: 'Meta cascote calidad',
    key: 'meta_cascote_calidad',
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
    { name: '%1ra calidad', data: datosGrafico?.primera },
    { name: '%2ra calidad', data: datosGrafico?.segunda },
    { name: '%3ra calidad', data: datosGrafico?.tercera },
    { name: '%Cascote', data: datosGrafico?.cascote },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getAllObj}
        titulo="Produccion/ Administracion/ Calidad"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={() => {}}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        setDatosGrafico={setDatosGrafica}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Porcentaje de calidad por periodo"
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

      <CalidadModal
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
