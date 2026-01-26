import TablaRetutilizable from '@components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '@service/Produccion/Administracion/IndiceConsumoBases.services';
import ConfirmModal from '@components/ConfirmModal';
import IndiceConsumoBasesModal from './IndiceConsumoBasesModal';
import ModalDesempeñoMes from './ModalDesempeñoMes';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';
import { periodoATexto } from '@helpers/normalze.helpers';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'Produccion ',
    key: 'produccion_prom',
  },
  {
    label: 'Consumo mensual',
    key: 'consumo_mensual_prom',
  },
  {
    label: 'Ratio consumo',
    key: 'ratio_consumo',
  },

  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
  },
  {
    label: 'Produccion acumulado',
    key: 'produccion_acumulada',
  },
  {
    label: 'Consumo mensual acumulado',
    key: 'consumo_acumulado',
  },
  {
    label: 'Ratio consumo acumulado',
    key: 'ratio_consumo_acumulado',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
];

export default function IndiceConsumoBases() {
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);
  const [datosGrafico, setDatosGrafica] = useState(null);
  //Cambiear meta

  const [openMeta, setOpenMeta] = useState(false);
  const [openMetaConfirm, setOpenMetaConfirm] = useState(false);
  const [payloadMeta, setPayloadMeta] = useState(null);

  //Detalles
  const [idRow, setIdRow] = useState(null);
  const [openDetalles, setOpenDetalles] = useState(false);
  //Detalles

  const handleOpenDetalles = (id) => {
    setIdRow(id);
    setOpenDetalles(true);
  };

  const handleCloseDetalles = () => {
    setOpenDetalles(false);
    setIdRow(null);
  };
  //Meta
  const handleOpenMeta = () => {
    setOpenMeta(true);
  };
  const handleOpenMetaConfirm = (payload) => {
    setPayloadMeta(payload);
    setOpenMetaConfirm(true);
  };
  const handleCreateMeta = async () => {
    try {
      setLoading(true);
      const res = await registerObjMetas(payloadMeta);
      if (res.ok) {
        toast.success(res.message || 'Registro creado con éxito');
        tableRef.current?.reload();
        setOpenMetaConfirm(false);
        setOpenMeta(false);
      }
      if (!res.ok) {
        setOpenMetaConfirm(false);
        throw new Error(res.message || 'Error al crear el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al crear el registro');
    } finally {
      setLoading(false);
    }
  };

  //*************+ */
  const labelCategorias = (datosGrafico?.categories ?? []).map((row) =>
    periodoATexto(row),
  );
  const series = [
    { name: 'Ratio consumo', data: datosGrafico?.ratio_consumo ?? [] },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Administracion/ Indice cosumo bases"
        datosBusqueda={['periodo']}
        columnas={columnas}
        isDetalle={true}
        handleDetail={handleOpenDetalles}
        isDelete={false}
        isEdit={false}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
        botonCrear={true}
        tituloBoton="Cambiar meta"
        handleCrear={handleOpenMeta}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Ratio de consumo de bases"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <ModalDesempeñoMes
        open={openDetalles}
        fetchById={getObjsDesempenioMes}
        id={idRow}
        onClose={handleCloseDetalles}
      />
      <IndiceConsumoBasesModal
        open={openMeta}
        onClose={() => setOpenMeta(false)}
        onSave={handleOpenMetaConfirm}
      />
      <ConfirmModal
        open={openMetaConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenMetaConfirm(false)}
        onConfirm={handleCreateMeta}
      />
    </>
  );
}
