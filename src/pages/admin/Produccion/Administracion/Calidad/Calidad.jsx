import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  getObjsPromedios,
  registerObjMetas,
  getAllObj,
} from '../../../../../service/Produccion/Administracion/Calidad.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import GraficoBarChart from '@components/GraficoBarChart';
import ModalDesempeñoMes from './ModalDespempeñoMes';
import CalidadModal from './CalidadModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  periodoATexto,
  normalizarPorcentaje,
} from '../../../../../helpers/normalze.helpers';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'Produccion mensual',
    key: 'produccion_mensual_prom',
  },
  {
    label: 'Presupuesto',
    key: 'presupuesto_prom',
  },
  {
    label: 'Produccion primera mensual',
    key: 'produccion_primera_prom',
  },
  {
    label: 'Produccion segunda mensual',
    key: 'produccion_segunda_prom',
  },
  {
    label: 'Produccion tercera mensual',
    key: 'produccion_tercera_prom',
  },
  {
    label: 'Produccion tercera mensual',
    key: 'produccion_cascote_prom',
  },
  //*********** */
  {
    label: 'Primera calidad porcentaje',
    key: 'primera_calidad_porcentaje',
    render: (row) => normalizarPorcentaje(row.primera_calidad_porcentaje),
  },

  {
    label: 'Segunda calidad porcentaje',
    key: 'segunda_calidad_porcentaje',
    render: (row) => normalizarPorcentaje(row.segunda_calidad_porcentaje),
  },
  {
    label: 'Tercera calidad porcentaje',
    key: 'tercera_calidad_porcentaje',
    render: (row) => normalizarPorcentaje(row.tercera_calidad_porcentaje),
  },
  {
    label: 'Cascote porcentaje',
    key: 'cascote_porcentaje',
    render: (row) => normalizarPorcentaje(row.cascote_porcentaje),
  },

  //********** */
  {
    label: 'Produccion acumulada',
    key: 'produccion_acumulada',
  },
  {
    label: '1ra calidad acumulada',
    key: 'primera_acumulada',
  },
  {
    label: 'Cascote acumulada',
    key: 'cascote_acumulada',
  },

  {
    label: '1ra acumulada [%]',
    key: 'primera_porcentaje_acumulada',
    render: (row) => normalizarPorcentaje(row.primera_porcentaje_acumulada),
  },
  {
    label: 'Cascote acumulada [%]',
    key: 'cascote_porcentaje_acumulada',
    render: (row) => normalizarPorcentaje(row.cascote_porcentaje_acumulada),
  },
  //******++ */
  {
    label: 'Meta primera',
    key: 'meta_primera',
  },
  {
    label: 'Meta cascote',
    key: 'meta_cascote',
  },
];

export default function Calidad() {
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  const [datosGrafico, setDatosGrafica] = useState(null);
  //crear
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateConfirm, setOpenCreateConfirm] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState({});
  //Detalles
  const [openDetalles, setOpenDetalles] = useState(false);
  const [idRow, setIdRow] = useState(null);

  //Detalles

  const handleOpenDetalles = (id) => {
    setIdRow(id);
    setOpenDetalles(true);
  };

  const handleCloseDetalles = () => {
    setOpenDetalles(false);
    setIdRow(null);
  };

  //crear
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
      const res = await registerObjMetas(payloadCreate);
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

  const labelCategorias = (datosGrafico?.categories ?? []).map((row) =>
    periodoATexto(row),
  );

  const series = [
    { name: '%1ra calidad', data: datosGrafico?.primera },
    { name: '%2ra calidad', data: datosGrafico?.segunda },
    { name: '%3ra calidad', data: datosGrafico?.tercera },
    { name: '%Cascote', data: datosGrafico?.cascote },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjsPromedios}
        titulo="Produccion/ Administracion/ Calidad"
        datosBusqueda={['periodo']}
        columnas={columnas}
        isDetalle={true}
        handleDetail={handleOpenDetalles}
        botonCrear={true}
        isDelete={false}
        isEdit={false}
        tituloBoton="Cambiar meta"
        handleCrear={handleOpenCreate}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Porcentaje de calidad por periodo"
          categories={labelCategorias}
          series={series}
          height={500}
          showToolbox
          showPercent={true}
          percentDecimals={2}
        />
      </div>
      <ModalDesempeñoMes
        open={openDetalles}
        fetchById={getAllObj}
        id={idRow}
        onClose={handleCloseDetalles}
      />
      <CalidadModal
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
