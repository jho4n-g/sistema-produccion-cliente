import TablaRetutilizable from '@components/TablaReutilizable';
import {
  deleteObj,
  getObjsUser,
  updateObj,
  getIdObj,
  registerObj,
} from '@service/Comercializacion/VentaTotal.services';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import VentaTotalModal from './VentaTotalModal';
import { normalizarFecha } from '@helpers/normalze.helpers';
import { getPeriodos } from '@service/auth/Gestion.services.js';
import EchartsStackedAreaChart from '@components/EchartsStackedAreaChart';
const columnas = [
  {
    label: 'Fecha',
    key: 'fecha',
    render: (row) => normalizarFecha(row.fecha),
  },
  {
    label: 'Presupuesto mensual',
    key: 'presupuesto_mensual',
  },
  {
    label: 'Venta mensual',
    key: 'venta_mensual',
  },
];

export default function VentaTotal() {
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
      name: 'Presupuesto mensual',
      data: datosGrafico?.presupuesto_mensual,
    },
    {
      name: 'Venta mensual',
      data: datosGrafico?.venta_mensual,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjsUser}
        titulo="Administracion/ Ingreso ventas total"
        datosBusqueda={['periodo']}
        columnas={columnas}
        isDetalle={false}
        handleDetail={() => {}}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
        isSeleccion={true}
        getSeleccion={getPeriodos}
        botonCrear={true}
        tituloBoton="Ingresar nuevo periodo"
        handleCrear={handleOpenCreate}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EchartsStackedAreaChart
          title="Venta total"
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
      <VentaTotalModal
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
      <VentaTotalModal
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
