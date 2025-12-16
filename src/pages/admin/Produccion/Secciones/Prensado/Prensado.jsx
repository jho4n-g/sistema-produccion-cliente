import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  getObjs,
  UpdateIdObj,
  deleteObj,
} from '../../../../../service/Produccion/Secciones/Prensado.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

const columnas = [
  { label: 'Fecha', key: 'fecha' },
  { label: 'N° prensa', key: 'n_prensa' },
  { label: 'Turno', key: 'turno' },
  { label: 'Formato', key: 'formato' },
  { label: 'Operador', key: 'operador' },
  { label: 'Producto', key: 'producto' },
  {
    label: 'Observaciones',
    key: 'observaciones_prensado_secado',
    render: (row) =>
      row.observaciones_prensado_secado?.map((o) => o.observacion).join(' | '),
  },
];

export default function Prensado() {
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

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
      toast.error(e.message || 'Error al eliminar el registro');
    } finally {
      setLoading(false);
    }
  };
  const closeDelete = () => {
    setOpenDelete(false);
    setIdRow(null);
  };
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjs}
        titulo="Produccion/ Control atomizado"
        datosBusqueda={[
          'fecha',
          'turno',
          'operador',
          'hora_inicio',
          'hora_final',
        ]}
        columnas={columnas}
        handleDetail={() => {}}
        handleEdit={() => {}}
        hanldeDelete={hanldeOpenConfirmDelete}
      />
      <ConfirmModal
        open={openModalDelete}
        title="Eliminar registro"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
        x
        danger
        onClose={closeDelete}
        onConfirm={hanldeDelete}
      />
    </>
  );
}
