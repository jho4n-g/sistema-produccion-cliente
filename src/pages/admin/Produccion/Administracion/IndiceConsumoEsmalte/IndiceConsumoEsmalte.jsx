import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '../../../../../service/Produccion/Administracion/IndiceConsumoEsmalte.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import ModalChartDesempenio from '@components/ModalChartDesempenio';
import IndiceConsumoEsmalteModal from './IndiceConsumoEsmalteModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';
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
    label: 'Meta [gr/m²]',
    key: 'meta_gr_m',
  },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
    render: (row) => normalizarPorcentaje(row.cumplimiento_mensual ?? 0),
  },
  {
    label: 'Produccion acumulada',
    key: 'produccion_acumulado',
  },
  {
    label: 'Consumo acumulado',
    key: 'consumo_acumulado',
  },
  {
    label: 'Ratio consumo acumulado',
    key: 'ratio_consumo_acumulado',
  },
  {
    label: '% Cumplimiento acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado ?? 0),
  },
  {
    label: 'Meta',
    key: 'meta',
  },
];

export default function IndiceConsumoEsmalte() {
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
    { name: 'Ratio consumo engobe', data: datosGrafico?.ratio_consumo },
  ];
  const seriesDos = [
    { name: 'Consumo mensual', data: datosGrafico?.consumo_mensual },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Administracion/ Indice cosumo esmalte"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={handleOpenDetalles}
        isDetalle={true}
        handleEdit={() => {}}
        hanldeDelete={() => {}}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
        botonCrear={true}
        tituloBoton="Ingresar nuevo periodo"
        handleCrear={handleOpenMeta}
        isDelete={false}
        isEdit={false}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Ratio de consumo"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Consumo mensual"
          categories={labelCategorias}
          series={seriesDos}
          height={400}
          showToolbox
        />
      </div>
      <IndiceConsumoEsmalteModal
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
        titleChart="Indice consumo engobe"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              { name: 'Produccion', data: g.produccion ?? [] },
              {
                name: 'Consumo mensual',
                data: g.consumo_mensual ?? [],
              },
            ],
          };
        }}
      />
    </>
  );
}
