import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  deleteObj,
  getAllObj,
  updateObj,
  getIdObj,
} from '../../../../service/Administracion/GeneracionResiduos.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import GeneracionResiduosModal from './GeneracionResiduosModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';

const columnas = [
  { label: 'Periodo', key: 'periodo' },
  { label: 'N trabajadores', key: 'n_trabajadores' },
  { label: 'Kg carton', key: 'kg_carton' },
  {
    label: 'Pe',
    key: 'pe',
  },
  {
    label: 'Kg strechfilm',
    key: 'kg_strechfilm',
  },
  {
    label: 'Kg bolsas bigbag',
    key: 'kg_bolsas_bigbag',
  },
  {
    label: 'Kg turriles plasticos',
    key: 'kg_turriles_plasticos',
  },
  {
    label: 'Kg envase mil litros',
    key: 'kg_envase_mil_litros',
  },

  {
    label: 'Sunchu kg',
    key: 'sunchu_kg',
  },
  {
    label: 'Kg madera',
    key: 'kg_madera',
  },
  {
    label: 'Kg bidon azul',
    key: 'kg_bidon_azul',
  },
  {
    label: 'Kg aceite sucio',
    key: 'kg_aceite_sucio',
  },
  {
    label: 'Kg bolsas plasticas transparentes',
    key: 'kg_bolsas_plasticas_transparentes',
  },
  {
    label: 'Kg bolsas yute',
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
      name: 'N trabajadoresdm',
      data: datosGrafico?.n_trabajadores,
    },
    {
      name: 'Kg carton',
      data: datosGrafico?.kg_carton,
    },
    {
      name: 'Pe',
      data: datosGrafico?.pe,
    },
    {
      name: 'Kg strechfilm',
      data: datosGrafico?.kg_strechfilm,
    },
    {
      name: 'Kg bolsas bigbag',
      data: datosGrafico?.kg_bolsas_bigbag,
    },
    {
      name: 'Kg turriles plasticos',
      data: datosGrafico?.kg_turriles_plasticos,
    },
    {
      name: 'Kg envase mil litros',
      data: datosGrafico?.kg_envase_mil_litros,
    },
    {
      name: 'Kg sunchu',
      data: datosGrafico?.sunchu_kg,
    },
    {
      name: 'Kg madera',
      data: datosGrafico?.kg_madera,
    },
    {
      name: 'Kg bidon azul',
      data: datosGrafico?.kg_bidon_azul,
    },
    {
      name: 'Kg aceite sucio',
      data: datosGrafico?.kg_aceite_sucio,
    },
    {
      name: 'Kg bolsas transparentes',
      data: datosGrafico?.kg_bolsas_plasticas_transparentes,
    },
    {
      name: 'Kg bolsas yute',
      data: datosGrafico?.kg_bolsas_yute,
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
      <GeneracionResiduosModal
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
