import TablaRetutilizable from '@components/TablaReutilizable';
import {
  deleteObj,
  getObjsUser,
  updateObj,
  getIdObj,
  registerObj,
} from '@service/Administracion/IndeceSeveridad.services';
import ConfirmModal from '@components/ConfirmModal';
import IndiceSeveridadModal from './IndiceSeveridadModal';
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
  { label: 'porcentaje_ausentismo', key: 'porcentaje_ausentismo' },
  {
    label: 'Dias baja medica administracion',
    key: 'dias_baja_medica_administracion',
  },
  {
    label: 'Dias baja medica mantenimiento',
    key: 'dias_baja_medica_mantenimiento',
  },
  {
    label: 'Dias baja medica produccion',
    key: 'dias_baja_medica_produccion',
  },
  {
    label: 'Dias baja medica comercializacion',
    key: 'dias_baja_medica_comercializacion',
  },
];

export default function IndiceSeveridad() {
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
      name: 'Dias baja medica administracion',
      data: datosGrafico?.dias_baja_medica_administracion,
    },
    {
      name: 'Dias baja medica mantenimiento',
      data: datosGrafico?.dias_baja_medica_mantenimiento,
    },
    {
      name: 'Dias baja medica administracion',
      data: datosGrafico?.dias_baja_medica_administracion,
    },
    {
      name: 'Dias baja medica produccion',
      data: datosGrafico?.dias_baja_medica_produccion,
    },
    {
      name: 'Dias baja medica comercializacion',
      data: datosGrafico?.dias_baja_medica_comercializacion,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjsUser}
        titulo="administracion/ Indice severidad"
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
          title="Indice Severidad"
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
      <IndiceSeveridadModal
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
      <IndiceSeveridadModal
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
