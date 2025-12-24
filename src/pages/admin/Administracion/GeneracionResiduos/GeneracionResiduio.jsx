import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
} from '../../../../service/Administracion/GeneracionResiduos.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Periodo', key: 'periodo' },
  { label: 'n_trabajadores', key: 'n_trabajadores' },
  { label: 'kg_carton', key: 'kg_carton' },
  {
    label: 'pe',
    key: 'pe',
  },
  {
    label: 'kg_strechfilm',
    key: 'kg_strechfilm',
  },
  {
    label: 'kg_bolsas_bigbag',
    key: 'kg_bolsas_bigbag',
  },
  {
    label: 'kg_turriles_plasticos',
    key: 'kg_turriles_plasticos',
  },
  {
    label: 'kg_envase_mil_litros',
    key: 'kg_envase_mil_litros',
  },

  {
    label: 'sunchu_kg',
    key: 'sunchu_kg',
  },
  {
    label: 'kg_madera',
    key: 'kg_madera',
  },
  {
    label: 'kg_bidon_azul',
    key: 'kg_bidon_azul',
  },
  {
    label: 'kg_aceite_sucio',
    key: 'kg_aceite_sucio',
  },
  {
    label: 'kg_bolsas_plasticas_transparentes',
    key: 'kg_bolsas_plasticas_transparentes',
  },
  {
    label: 'kg_bolsas_yute',
    key: 'kg_bolsas_yute',
  },
];

export default function GeneracionResiduos() {
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
