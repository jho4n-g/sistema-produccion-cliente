import TablaRetutilizable from '@components/TablaReutilizable';
import {
  deleteObj,
  getObjsUser,
  updateObj,
  getIdObj,
  registerObj,
} from '@service/Administracion/GeneracionResiduos.services';
import ConfirmModal from '@components/ConfirmModal';
import GeneracionResiduosModal from './GeneracionResiduosModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';
import { normalizarFecha } from '@helpers/normalze.helpers';
import { getPeriodos } from '@service/auth/Gestion.services.js';
import EchartsStackedAreaChart from '@components/EchartsStackedAreaChart';

const columnas = [
  {
    label: 'Fecha',
    key: 'fecha',
    render: (row) => normalizarFecha(row.fecha),
  },
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
  //crear
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateConfirm, setOpenCreateConfirm] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState({});

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
  //create
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleOpenConfirmCreate = (data) => {
    setPayloadCreate(data);
    setOpenCreateConfirm(true);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await registerObj(payloadCreate);
      if (res.ok) {
        toast.success(res.message || 'Registro creado con éxito');
        tableRef.current?.reload();
        setOpenCreateConfirm(false);
        setOpenCreate(false);
      }
      if (!res.ok) {
        setOpenCreateConfirm(false);
        throw new Error(res.message || 'Error al crear el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al crear el registro');
    } finally {
      setLoading(false);
    }
  };
  const labelCategorias = datosGrafico?.categories ?? [];
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
        getObj={getObjsUser}
        titulo="Produccion/ Generacion de residuos solidos"
        datosBusqueda={['fecha']}
        columnas={columnas}
        handleDetail={() => {}}
        isDetalle={false}
        handleEdit={hanldeEdit}
        hanldeDelete={hanldeOpenConfirmDelete}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
        botonCrear={true}
        tituloBoton="Ingresar nuevo periodo"
        handleCrear={handleOpenCreate}
        isSeleccion={true}
        getSeleccion={getPeriodos}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EchartsStackedAreaChart
          title="Hora extra"
          categories={labelCategorias}
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
        isEdit={true}
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
      <GeneracionResiduosModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleOpenConfirmCreate}
      />
      <ConfirmModal
        open={openCreateConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenCreateConfirm(false)}
        onConfirm={handleCreate}
      />
    </>
  );
}
