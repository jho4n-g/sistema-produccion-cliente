import TablaRetutilizable from '@components/TablaReutilizable';
import {
  createDocuments,
  delelteDocument,
  getDocumentsNovedades,
  updatedDocument,
  getIdDocumentNovedad,
} from '@service/Documentos/Novedades';
import ConfirmModal from '@components/ConfirmModal';
import BoletinModal from './BoletinModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  {
    label: 'Fecha',
    key: 'fecha',
  },
  { label: 'Titulo', key: 'titulo' },
  { label: 'gestion', key: 'gestion' },
  { label: 'descripcion', key: 'descripcion' },
];

export default function Politica() {
  const [idRow, setIdRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  //delete
  const [openModalDelete, setOpenDelete] = useState(false);
  //update
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openConfirmUpdate, setOpenConfirmUpdate] = useState(false);
  const [payloadUpdate, setPayloadUpdate] = useState(null);
  //create
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
  //delete

  const hanldeOpenConfirmDelete = (id) => {
    setIdRow(id);
    setOpenDelete(true);
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
    setOpenUpdate(true);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayloadUpdate(data);
    setOpenConfirmUpdate(true);
  };
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await updatedDocument(idRow, payloadUpdate);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setOpenConfirmUpdate(false);
        tableRef.current?.reload();
        setOpenUpdate(false);
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
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getDocumentsNovedades}
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

      <BoletinModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdDocumentNovedad}
        id={idRow}
        isEditing={true}
      />
      <ConfirmModal
        open={openConfirmUpdate}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenConfirmUpdate(false)}
        onConfirm={handleUpdate}
      />
      <BoletinModal
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
