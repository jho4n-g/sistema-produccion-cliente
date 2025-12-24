import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
} from '../../../../../service/Produccion/Administracion/Calidad.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Periodo', key: 'periodo' },
  {
    label: 'produccion_mensual',
    key: 'produccion_mensual',
  },
  {
    label: 'presupuesto',
    key: 'presupuesto',
  },
  {
    label: 'produccion_primera_mensual',
    key: 'produccion_primera_mensual',
  },
  {
    label: 'produccion_segunda_mensual',
    key: 'produccion_segunda_mensual',
  },
  {
    label: 'produccion_tercera_mensual',
    key: 'produccion_tercera_mensual',
  },
  //*********** */
  {
    label: 'primera_calidad_porcentaje',
    key: 'primera_calidad_porcentaje',
  },
  {
    label: 'segunda_calidad_porcentaje',
    key: 'segunda_calidad_porcentaje',
  },
  {
    label: 'tercera_calidad_porcentaje',
    key: 'tercera_calidad_porcentaje',
  },
  {
    label: 'cascote_porcentaje',
    key: 'cascote_porcentaje',
  },

  //********** */
  {
    label: 'primera_acumulada',
    key: 'primera_acumulada',
  },
  {
    label: 'cascote_acumulada',
    key: 'cascote_acumulada',
  },
  {
    label: 'primera_acumulado_procentaje',
    key: 'primera_acumulado_procentaje',
  },
  {
    label: 'cascote_acumulado_procentaje',
    key: 'cascote_acumulado_procentaje',
  },
  //******++ */
  {
    label: 'meta_primera_calidad',
    key: 'meta_primera_calidad',
  },
  {
    label: 'meta_cascote_calidad',
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
        titulo="Produccion/ Administracion/ Calidad"
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
