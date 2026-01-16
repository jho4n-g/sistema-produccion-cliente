import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
  getIdObj,
} from '../../../../service/Administracion/HorasExtra.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import HoraExtraModal from './HoraExtraModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';
import { periodoATexto } from '../../../../helpers/normalze.helpers';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
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
    label: 'Cc',
    key: 'cc',
  },
  {
    label: 'Seg ind',
    key: 'seg_ind',
  },
  {
    label: 'Region centro',
    key: 'r_centro',
  },

  {
    label: 'Region oeste',
    key: 'r_oeste',
  },
  {
    label: 'Region este',
    key: 'r_este',
  },
  {
    label: 'Region fabr',
    key: 'r_fabr',
  },
  {
    label: 'Total personas',
    key: 'total_personas',
  },
  {
    label: 'Indice horas extra',
    key: 'indice_horas_extra',
  },
  {
    label: 'Indice horas extra acumulado',
    key: 'indice_horas_extra_acumulado',
  },
  {
    label: 'Cumplimineto meta',
    key: 'cumplimineto_meta',
  },
  {
    label: 'Meta',
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
  const [datosGrafico, setDatosGrafica] = useState(null);

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
  const series = [
    {
      name: 'Adm',
      data: datosGrafico?.adm,
    },
    {
      name: 'Prd',
      data: datosGrafico?.prd,
    },
    {
      name: 'Mantto',
      data: datosGrafico?.mantto,
    },
    {
      name: 'Ampliacion',
      data: datosGrafico?.ampliacion,
    },
    {
      name: 'Cc',
      data: datosGrafico?.cc,
    },
    {
      name: 'Seg ind',
      data: datosGrafico?.seg_ind,
    },
    {
      name: 'Region centro',
      data: datosGrafico?.r_centro,
    },
    {
      name: 'Region oeste',
      data: datosGrafico?.r_oeste,
    },
    {
      name: 'Region este',
      data: datosGrafico?.r_este,
    },
    {
      name: 'Region fabr',
      data: datosGrafico?.r_fabr,
    },
  ];
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
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Hora extra por areas"
          categories={datosGrafico?.categories}
          series={series}
          height={400}
          showToolbox
        />
      </div>
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
      <HoraExtraModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdObj}
        id={idRow}
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
        onConfirm={handleSave}
      />
    </>
  );
}
