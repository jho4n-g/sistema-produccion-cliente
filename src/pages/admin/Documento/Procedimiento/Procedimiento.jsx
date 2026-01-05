import TablaRetutilizable from '@components/TablaReutilizable';
import {
  createDocuments,
  delelteDocument,
  getDocumentsProcedimiento,
  updatedDocument,
  getIdObj,
} from '@service/Documentos/Procedimientos';
import ConfirmModal from '@components/ConfirmModal';
import ProcedimientoModal from './ProcedimientoModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  {
    label: 'Fecha',
    key: 'fecha',
  },
  { label: 'Titulo', key: 'titulo' },
  { label: 'Area', key: 'area' },
  { label: 'Codigo', key: 'codigo' },
  { label: 'Revision', key: 'revision' },
  { label: 'Descripcion', key: 'descripcion' },
];

export default function Calidad() {
  const tableRef = useRef(null);

  const [idRow, setIdRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openDelete, setDelete] = useState(false);
  //Editar
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payloadUpdate, setPayloadUpdate] = useState(null);
  //create
  const [openCreate, setOpenCreate] = useState(false);
  const [openConfirmCreate, setOpenConfirmCreate] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState(false);

  //create
  const handleCreate = (payload) => {
    setPayloadCreate(payload);
    setOpenConfirmCreate(true);
  };
  const handleConfirmCreate = async () => {
    try {
      setLoading(true);
      const res = await createDocuments(payloadCreate);
      if (res.ok) {
        toast.success(res.message || 'Registro guardado con éxito');
        setOpenConfirmCreate(false);
        setOpenCreate(false);
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
  //update

  const hanldeOpenConfirmDelete = (id) => {
    setIdRow(id);
    setDelete(true);
  };
  const hanldeDelete = async () => {
    setLoading(true);
    try {
      const res = await delelteDocument(idRow);
      if (res.ok) {
        toast.success('Registro eliminado con éxito');
        closeDelete();
        tableRef.current?.reload();
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al eliminar el registro');
        openDelete(false);
      }
    } catch (e) {
      toast.error(e.message || 'Problemos en el servidor');
    } finally {
      setLoading(false);
    }
  };
  const closeDelete = () => {
    setDelete(false);
    setIdRow(null);
  };

  const hanldeEdit = (id) => {
    setIdRow(id);
    setOpenUpdate(true);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayloadUpdate(data);
    setOpenModalUpdate(true);
  };
  const handleCloseConfirmUpdate = () => {
    setIdRow(null);
    setPayloadUpdate(null);
    setOpenModalUpdate(false);
  };
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await updatedDocument(idRow, payloadUpdate);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setOpenModalUpdate(false);
        tableRef.current?.reload();
        setOpenUpdate(false);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al actualizar el registro12');
        setOpenConfirmCreate(false);
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar el registro');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getDocumentsProcedimiento}
        titulo="Control documentos/ Procedimientos"
        datosBusqueda={['titulo']}
        columnas={columnas}
        handleDetail={() => {}}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        botonCrear={true}
        tituloBoton="Nuevo documento"
        handleCrear={() => setOpenCreate(true)}
      />
      <ConfirmModal
        open={openDelete}
        title="Eliminar registro"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
        danger
        onClose={closeDelete}
        onConfirm={hanldeDelete}
      />

      <ProcedimientoModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdObj}
        id={idRow}
        isEditing={true}
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
        onConfirm={handleUpdate}
      />
      <ProcedimientoModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreate}
      />
      <ConfirmModal
        open={openConfirmCreate}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => {
          setOpenConfirmCreate(false);
        }}
        onConfirm={handleConfirmCreate}
      />
    </>
  );
}
