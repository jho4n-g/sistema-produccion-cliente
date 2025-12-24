import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
} from '../../../../service/Administracion/IndiceFrecuencia.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Periodo', key: 'periodo' },
  { label: 'n_trabajadores', key: 'n_trabajadores' },
  { label: 'porcentaje_ausentismo', key: 'porcentaje_ausentismo' },
  {
    label: 'accidentes_administracion_personas',
    key: 'accidentes_administracion_personas',
  },
  {
    label: 'accidentes_mantenieminto_personas',
    key: 'accidentes_mantenieminto_personas',
  },
  {
    label: 'accidentes_produccion_personas',
    key: 'accidentes_produccion_personas',
  },
  {
    label: 'accidentes_comercializacion_personas',
    key: 'accidentes_comercializacion_personas',
  },
  {
    label: 'meta',
    key: 'meta',
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
        titulo="administracion/ Indice frecuencia"
        datosBusqueda={['periodo']}
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
