import TablaRetutilizable from '@components/TablaReutilizable';
import { useState, useRef } from 'react';
import {
  getObjs,
  UpdateIdObj,
  getIdObj,
  deleteObj,
  registerObj,
} from '@service/Produccion/Secciones/Formato.services';
import { toast } from 'react-toastify';
import FormatoModal from './FormatoModal';
import ConfirmModal from '@components/ConfirmModal';
const columnas = [
  { label: 'Formato', key: 'nombre' },
  { label: 'Metros por caja', key: 'caja_metros' },
  { label: 'Piezas por caja', key: 'caja_piezas' },
  { label: 'Metros por piezas', key: 'piezas_metro' },
  {
    label: 'Detalles prensa',
    key: 'detalles',
    render: (row) => (
      <div className="max-w-110 whitespace-normal wrap-break-word">
        {row.detalles?.map((o) => (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 m-1">
            Linea: {o.linea} , Alias: {o.alias} , Cantidad: {o.cantidad}
          </span>
        ))}
      </div>
    ),
  },
];

export default function Formato() {
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  //editar
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payload, setPayload] = useState(null);
  //crear
  const [openCrear, setOpenCrear] = useState(false);
  const [openConfirmCrear, setOpenConfirmCrear] = useState(false);
  const [payloadCrear, setPayloadCrear] = useState(null);

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
    setOpenModal(false);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await UpdateIdObj(idRow, payload);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        handleCloseConfirmUpdate();
        tableRef.current?.reload();
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

  //crear
  const openCreateModal = (data) => {
    console.log('click');
    setOpenConfirmCrear(true);
    setPayloadCrear(data);
  };
  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await registerObj(payloadCrear);

      if (res.ok) {
        toast.success('Registro creado correctamente');
        setOpenConfirmCrear(false);
        tableRef.current?.reload();
        setOpenCrear(false);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al crear el registro');
        setOpenConfirmCrear(false);
      }
    } catch (e) {
      toast.error(e.message || 'Error al crear el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjs}
        titulo="Producción - Formatos"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={() => {}}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        isDetalle={false}
        tituloBoton="Crear nueva formato"
        botonCrear={true}
        handleCrear={() => setOpenCrear(true)}
      />
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
      <FormatoModal
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
        onClose={() => setOpenModalUpdate(false)}
        onConfirm={handleSave}
      />
      <FormatoModal
        open={openCrear}
        onClose={() => setOpenCrear(false)}
        onSave={openCreateModal}
      />
      <ConfirmModal
        open={openConfirmCrear}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenConfirmCrear(false)}
        onConfirm={handleCreate}
      />
    </>
  );
}
