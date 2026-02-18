import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjs,
  registerObj,
  getIdObj,
  UpdateIdObj,
  deleteObj,
} from '@service/secretaria/CorrespondenciaExternoComercial.services.js';
import ConfirmModal from '@components/ConfirmModal';
import CorrespondenciaExternaComerialModal from './CorrespondenciaExternaComerialModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { normalizarFecha } from '@helpers/normalze.helpers';
import CorrespondenciaExternaComercialDetalles from './CorrespondenciaExternaComercialDetalles';

const columnas = [
  {
    label: 'Fecha entregado',
    key: 'fecha_entregado',
    render: (row) => normalizarFecha(row.fecha_entregado),
  },
  {
    label: 'Entregado por',
    key: 'entregado_por',
  },

  { label: 'Documento', key: 'documento' },
  { label: 'Enviado por', key: 'enviado_por' },
  {
    label: 'Descripcion',
    key: 'descripcion',
  },
  {
    label: 'Entragado a',
    key: 'entragado_a',
  },
  {
    label: 'Devolucion',
    key: 'dev',
    render: (row) => (
      <div className="max-w-50 whitespace-normal wrap-break-word">
        {row?.dev ? (
          <span
            key={row.id}
            className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 m-1"
          >
            Si devuelto
          </span>
        ) : (
          <span
            key={row.id}
            className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 m-1"
          >
            No devuelto
          </span>
        )}
      </div>
    ),
  },
  {
    label: 'Fecha devolucion',
    key: 'fecha_devolucion',
    render: (row) => normalizarFecha(row.fecha_devolucion),
  },
  {
    label: 'Derivado a',
    key: 'derivado_a',
  },
];

export default function CorrespondenciaExternaComercial() {
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
  //detalles
  const [openDetails, setOpenDetails] = useState(false);
  const [detailId, setDetailId] = useState(null);
  //Detalles
  const handleView = (id) => {
    setDetailId(id);
    setOpenDetails(true);
  };
  //create
  const handleCreate = (payload) => {
    setPayloadCreate(payload);
    setOpenConfirmCreate(true);
  };
  const handleConfirmCreate = async () => {
    try {
      setLoading(true);
      const res = await registerObj(payloadCreate);
      if (res.ok) {
        toast.success(res.message || 'Registro guardado con éxito');
        setOpenConfirmCreate(false);
        setOpenCreate(false);
        tableRef.current?.reload();
      }
      if (!res.ok) {
        setOpenConfirmUpdate(false);
        toast.error(res.message || 'Error al guardar el registro12');
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar el registro');
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
    setOpenUpdate(true);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayloadUpdate(data);
    setOpenConfirmUpdate(true);
  };
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await UpdateIdObj(idRow, payloadUpdate);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setOpenConfirmUpdate(false);
        tableRef.current?.reload();
        setOpenUpdate(false);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al actualizar el registro12');
        setOpenConfirmUpdate(false);
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
        getObj={getObjs}
        titulo="Secretaria/ Correspondencia externa - Comercial"
        datosBusqueda={[
          'entregado_por',
          'documento',
          'enviado_por',
          'entragado_a',
          'dev',
          'derivado_a',
        ]}
        columnas={columnas}
        handleDetail={handleView}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        botonCrear={true}
        tituloBoton="Nuevo registro"
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

      <CorrespondenciaExternaComerialModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdObj}
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
      <CorrespondenciaExternaComerialModal
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
      <CorrespondenciaExternaComercialDetalles
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fetchById={getIdObj}
        id={detailId}
      />
    </>
  );
}
