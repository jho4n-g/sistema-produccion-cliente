import TablaRetutilizable from '@components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '@service/Administracion/IndiceFrecuencia.services';
import IndiceFrecuenciaModal from './IndiceFrecuenciaModal';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import EchartsStackedAreaChart from '@components/EchartsStackedAreaChart';
import { periodoATexto } from '@helpers/normalze.helpers';
import ModalChartDesempenio from '@components/ModalChartDesempenio';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'N trabajadores', key: 'n_trabajadores_prom' },
  { label: 'Hora trabajadas mes', key: 'horas_trabajadas_mes' },
  { label: 'Porcentaje ausentismo', key: 'porcentaje_ausentismo_prom' },
  { label: 'Horas expuesta riesgo', key: 'horas_expuesta_riesgo' },
  {
    label: 'Accidentes administracion personas',
    key: 'accidentes_administracion_personas_prom',
  },
  {
    label: 'Accidentes mantenieminto personas',
    key: 'accidentes_mantenieminto_personas_prom',
  },
  {
    label: 'Accidentes produccion personas',
    key: 'accidentes_produccion_personas_prom',
  },
  {
    label: 'Accidentes comercializacion personas',
    key: 'accidentes_comercializacion_personas_prom',
  },
  {
    label: 'Accidentes mes',
    key: 'accidente_por_mes',
  },
  {
    label: 'Indice frecuencia mensual',
    key: 'indice_frecuencia',
  },
  {
    label: 'Indice frecuencia acumulado',
    key: 'indice_frecuencia_acumulado',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
];

export default function IndiceFrecuencia() {
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
    {
      name: 'Indice frecuencia',
      data: datosGrafico?.indice_frecuencia,
    },
  ];
  const seriesTwo = [
    {
      name: 'Indice frecuencia acumulado',
      data: datosGrafico?.indice_frecuencia_acumulado,
    },
  ];

  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="administracion/ Indice frecuencia"
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
        <EchartsStackedAreaChart
          title="Indice Frecuencia mensual"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EchartsStackedAreaChart
          title="Indice Frecuencia mensual acumulado"
          categories={labelCategorias}
          series={seriesTwo}
          height={400}
          showToolbox
        />
      </div>
      <IndiceFrecuenciaModal
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
        titleChart="Horas extra"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              {
                name: 'Accidentes administracion personas',
                data: g?.accidentes_administracion_personas,
              },
              {
                name: 'Accidentes mantenieminto personas',
                data: g?.accidentes_mantenieminto_personas,
              },
              {
                name: 'Accidentes produccion personas',
                data: g?.accidentes_produccion_personas,
              },
              {
                name: 'Accidentes comercializacion personas',
                data: g?.accidentes_comercializacion_personas,
              },
            ],
          };
        }}
      />
    </>
  );
}
