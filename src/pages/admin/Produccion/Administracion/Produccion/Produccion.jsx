import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '../../../../../service/Produccion/Administracion/Produccion.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import ProduccionModal from './ProduccionModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';
import {
  periodoATexto,
  normalizarPorcentaje,
} from '../../../../../helpers/normalze.helpers';
import ModalChartDesempenio from '@components/ModalChartDesempenio';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'Presupuesto',
    key: 'presupuesto_prom',
  },
  {
    label: 'Produccion mensual',
    key: 'produccion_mensual_prom',
  },
  {
    label: 'Produccion acumulada',
    key: 'produccion_acumulado',
  },
  {
    label: 'Presupuesto acumulado',
    key: 'presupuesto_acumulado',
  },
  {
    label: 'Diferencia entre produccion y presupuesto acumualdo',
    key: 'dif_acu_produ_presu',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
    render: (row) => normalizarPorcentaje(row.cumplimiento_mensual),
  },
  {
    label: 'Cumplimiento mensual acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado),
  },
];

export default function Produccion() {
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
  const labelCategorias = (datosGrafico?.categories ?? []).map((row) =>
    periodoATexto(row),
  );
  const series = [
    { name: 'Presupuesto', data: datosGrafico?.presupuesto },
    { name: 'Produccion mensual', data: datosGrafico?.produccion_mensual },
    { name: 'Produccion acumulada', data: datosGrafico?.produccion_acumulado },
    {
      name: 'Presupuesto acumulado',
      data: datosGrafico?.presupuesto_acumulado,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Administracion/ Monitoreo gases combustion"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={handleOpenDetalles}
        isDetalle={true}
        hanldeDelete={() => {}}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
        botonCrear={true}
        tituloBoton="Cambiar meta"
        handleCrear={handleOpenMeta}
        isDelete={false}
        isEdit={false}
      />

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Monoxido de carbono"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>

      <ProduccionModal
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
      <ModalChartDesempenio
        open={openDetalles}
        onClose={handleCloseDetalles}
        fetchById={getObjsDesempenioMes}
        id={idRow}
        titleModal="Desempeño del mes"
        titleChart="Produccion"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              { name: 'Presupuesto', data: g.presupuesto ?? [] },
              {
                name: 'Produccion mensual',
                data: g.produccion_mensual ?? [],
              },
            ],
          };
        }}
      />
    </>
  );
}
