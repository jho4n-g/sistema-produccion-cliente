import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
} from '../../../../service/Administracion/ConsultorioDental.services';
import ConfirmModal from '../../../../components/ConfirmModal';
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
  { label: 'N° trabajadores', key: 'n_trabajadores' },
  { label: 'Produccion', key: 'produccion' },
  { label: 'N° consultas trabajadores', key: 'numero_consultas_trabajadores' },
  {
    label: 'Consultas preventivas trabajadores',
    key: 'consultas_preventivas_trabajadores',
  },
  {
    label: 'Consultas curativas trabajadores',
    key: 'consultas_curativas_trabajadores',
  },
  {
    label: 'Consultas preventivas familiares',
    key: 'consultas_preventivas_familiares',
  },
  {
    label: 'Consultas curativas familiares',
    key: 'consultas_curativas_familiares',
  },
  {
    label: 'Total consultas',
    key: 'total_consultas',
  },
  {
    label: 'Ratio',
    key: 'ratio',
  },
  {
    label: 'Ratio produccion',
    key: 'ratio_produccion',
  },
];

export default function ConsultorioDental() {
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
        toast.error(res.message || 'Error al actualizar el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar el registro');
    } finally {
      setLoading(false);
    }
  };
  const series = [
    {
      name: 'N trabajadores',
      data: datosGrafico?.n_trabajadores,
    },
    {
      name: 'Consultas preventivas trabajadores',
      data: datosGrafico?.consultas_preventivas_trabajadores,
    },
    {
      name: 'Consultas curativas trabajadores',
      data: datosGrafico?.consultas_curativas_trabajadores,
    },
    {
      name: 'Consultas preventivas familiares',
      data: datosGrafico?.consultas_preventivas_familiares,
    },
    {
      name: 'Consultas curativas familiares',
      data: datosGrafico?.consultas_curativas_familiares,
    },
    {
      name: 'Total consultas trabajadores',
      data: datosGrafico?.numero_consultas_trabajadores,
    },
    {
      name: 'Total consultas',
      data: datosGrafico?.total_consultas,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getAllObj}
        titulo="Administracion/ Consultorio dental"
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
    </>
  );
}
