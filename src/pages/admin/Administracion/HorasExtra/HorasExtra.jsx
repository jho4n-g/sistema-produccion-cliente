import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
} from '../../../../service/Administracion/HorasExtra.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Periodo', key: 'periodo' },
  { label: 'adm', key: 'adm' },
  { label: 'prd', key: 'prd' },
  {
    label: 'mantto',
    key: 'mantto',
  },
  {
    label: 'ampliacion',
    key: 'ampliacion',
  },
  {
    label: 'cc',
    key: 'cc',
  },
  {
    label: 'seg_ind',
    key: 'seg_ind',
  },
  {
    label: 'r_centro',
    key: 'r_centro',
  },

  {
    label: 'r_oeste',
    key: 'r_oeste',
  },
  {
    label: 'r_este',
    key: 'r_este',
  },
  {
    label: 'r_fabr',
    key: 'r_fabr',
  },
  {
    label: 'total_personas',
    key: 'total_personas',
  },
  {
    label: 'indice_horas_extra',
    key: 'indice_horas_extra',
  },
  {
    label: 'indice_horas_extra_acumulado',
    key: 'indice_horas_extra_acumulado',
  },
  {
    label: 'cumplimineto_meta',
    key: 'cumplimineto_meta',
  },
  {
    label: 'meta',
    key: 'meta',
  },
];

export default function HorasExtra() {
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
        titulo="Produccion/ Control de proceso de seleccion y embalaje"
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
