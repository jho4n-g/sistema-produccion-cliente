import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
} from '../../../../service/Administracion/AtencionConsultorio.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Periodo', key: 'periodo' },
  { label: 'alsbm', key: 'alsbm' },
  { label: 'alcbm', key: 'alcbm' },
  { label: 'alegrias', key: 'alegrias' },
  { label: 'cardivasculares', key: 'cardivasculares' },
  { label: 'cefaleas', key: 'cefaleas' },
  { label: 'oftamologias', key: 'oftamologias' },
  { label: 'respiratorias', key: 'respiratorias' },
  { label: 'opticas', key: 'opticas' },
  { label: 'digestivas', key: 'digestivas' },
  { label: 'genitourinarias', key: 'genitourinarias' },

  { label: 'musculo_esqueletico', key: 'musculo_esqueletico' },
  { label: 'articulares', key: 'articulares' },
  { label: 'columna_vertebras', key: 'columna_vertebras' },
  { label: 'piel', key: 'piel' },
  { label: 'neurologias', key: 'neurologias' },
  { label: 'odontologias', key: 'odontologias' },
  { label: 'quemaduras', key: 'quemaduras' },
  { label: 'curaciones', key: 'curaciones' },
  { label: 'otras', key: 'otras' },
];

export default function AtencionConsultorio() {
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payload, setPayload] = useState(null);

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
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getAllObj}
        titulo="Administracion/ Atencion Consultorio"
        datosBusqueda={['fecha', 'turno', 'operador']}
        columnas={columnas}
        handleDetail={() => {}}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
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
    </>
  );
}
