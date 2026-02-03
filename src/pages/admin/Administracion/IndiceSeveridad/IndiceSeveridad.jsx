import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '../../../../service/Administracion/IndeceSeveridad.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import IndiceSeveridadModal from './IndiceSeveridadModal';
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
  {
    label: 'Horas trabajadas mes',
    key: 'horas_trabajadas_mes',
  },
  { label: 'porcentaje_ausentismo', key: 'porcentaje_ausentismo_prom' },
  { label: 'Horas expuesta riesgo', key: 'horas_expuesta_riesgo' },
  {
    label: 'Dias baja medica administracion',
    key: 'dias_baja_medica_administracion_prom',
  },
  {
    label: 'Dias baja medica mantenimiento',
    key: 'dias_baja_medica_mantenimiento_prom',
  },
  {
    label: 'Dias baja medica produccion',
    key: 'dias_baja_medica_produccion_prom',
  },
  {
    label: 'Dias baja medica comercializacion',
    key: 'dias_baja_medica_comercializacion_prom',
  },

  {
    label: 'Dias baja medica mes',
    key: 'dias_baja_medica',
  },
  {
    label: 'Indice gravedad',
    key: 'indice_gravedad',
  },
  {
    label: 'Indice gravedad acumulado',
    key: 'indice_gravedad_acumulado',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
];

export default function IndiceSeveridad() {
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
      name: 'Indice gravedad',
      data: datosGrafico?.indice_gravedad,
    },
  ];
  const seriesTwo = [
    {
      name: 'Indice gravedad acumulado',
      data: datosGrafico?.indice_gravedad_acumulado,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="administracion/ Indice severidad"
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
        tituloBoton="Cambiar meta"
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
      <IndiceSeveridadModal
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
        titleChart="Indice severidad"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              {
                name: 'Dias baja medica administracion',
                data: g?.dias_baja_medica_administracion,
              },
              {
                name: 'Dias baja medica mantenimiento',
                data: g?.dias_baja_medica_mantenimiento,
              },
              {
                name: 'Dias baja medica administracion',
                data: g?.dias_baja_medica_administracion,
              },
              {
                name: 'Dias baja medica produccion',
                data: g?.dias_baja_medica_produccion,
              },
              {
                name: 'Dias baja medica comercializacion',
                data: g?.dias_baja_medica_comercializacion,
              },
            ],
          };
        }}
      />
    </>
  );
}
