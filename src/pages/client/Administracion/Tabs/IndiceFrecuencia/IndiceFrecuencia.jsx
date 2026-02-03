import TablaRetutilizable from '@components/TablaReutilizable';
import {
  deleteObj,
  getObjsUser,
  updateObj,
  getIdObj,
  registerObj,
} from '@service/Administracion/IndiceFrecuencia.services';
import IndiceFrecuenciaModal from './IndiceFrecuenciaModal';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { normalizarFecha } from '@helpers/normalze.helpers';
import { getPeriodos } from '@service/auth/Gestion.services.js';
import EchartsStackedAreaChart from '@components/EchartsStackedAreaChart';

const columnas = [
  {
    label: 'Fecha',
    key: 'fecha',
    render: (row) => normalizarFecha(row.fecha),
  },
  { label: 'N trabajadores', key: 'n_trabajadores' },
  { label: 'Porcentaje ausentismo', key: 'porcentaje_ausentismo' },
  {
    label: 'Accidentes administracion personas',
    key: 'accidentes_administracion_personas',
  },
  {
    label: 'Accidentes mantenieminto personas',
    key: 'accidentes_mantenieminto_personas',
  },
  {
    label: 'Accidentes produccion personas',
    key: 'accidentes_produccion_personas',
  },
  {
    label: 'Accidentes comercializacion personas',
    key: 'accidentes_comercializacion_personas',
  },
];

export default function IndiceFrecuencia() {
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payload, setPayload] = useState(null);
  const [datosGrafico, setDatosGrafica] = useState(null);
  //crear
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateConfirm, setOpenCreateConfirm] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState({});

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
  //create
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleOpenConfirmCreate = (data) => {
    setPayloadCreate(data);
    setOpenCreateConfirm(true);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await registerObj(payloadCreate);
      if (res.ok) {
        toast.success(res.message || 'Registro creado con éxito');
        tableRef.current?.reload();
        setOpenCreateConfirm(false);
        setOpenCreate(false);
      }
      if (!res.ok) {
        setOpenCreateConfirm(false);
        throw new Error(res.message || 'Error al crear el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al crear el registro');
    } finally {
      setLoading(false);
    }
  };
  const labelCategorias = datosGrafico?.categories ?? [];
  const series = [
    {
      name: 'Accidentes administracion personas',
      data: datosGrafico?.accidentes_administracion_personas,
    },
    {
      name: 'Accidentes mantenieminto personas',
      data: datosGrafico?.accidentes_mantenieminto_personas,
    },
    {
      name: 'Accidentes produccion personas',
      data: datosGrafico?.accidentes_produccion_personas,
    },
    {
      name: 'Accidentes comercializacion personas',
      data: datosGrafico?.accidentes_comercializacion_personas,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjsUser}
        titulo="administracion/ Indice frecuencia"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={() => {}}
        isDetalle={false}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
        botonCrear={true}
        tituloBoton="Ingresar nuevo periodo"
        handleCrear={handleOpenCreate}
        isSeleccion={true}
        getSeleccion={getPeriodos}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EchartsStackedAreaChart
          title="Indice Frecuencia"
          categories={labelCategorias}
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
      <IndiceFrecuenciaModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdObj}
        id={idRow}
        isEdit={true}
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
      <IndiceFrecuenciaModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleOpenConfirmCreate}
      />
      <ConfirmModal
        open={openCreateConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenCreateConfirm(false)}
        onConfirm={handleCreate}
      />
    </>
  );
}
