import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '../../../../../service/Produccion/Administracion/IndiceConsumoLinea.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import IndiceConsumoLineaModal from './IndiceConsumoLineaModal';
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
    render: (row) => normalizarPorcentaje(row.cumplimiento_mensual),
  },
  {
    label: 'Produccion acumulado',
    key: 'produccion_acumulado',
  },
  {
    label: 'Consumo mensual acumulado',
    key: 'consumo_mensual_acumulado',
  },
  {
    label: 'Indice consumo acumulado',
    key: 'indice_consumo_acumulado',
  },
  {
    label: 'Cumplimineto acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado),
  },
];

export default function IndiceConsumoLinea() {
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

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

  const [datosGrafico, setDatosGrafica] = useState(null);

  const labelCategorias = (datosGrafico?.categories ?? []).map((row) =>
    periodoATexto(row),
  );
  const series = [
    {
      name: 'Ratio de cosumo insumos linea',
      data: datosGrafico?.ratio_consumo,
    },
  ];
  const seriesDos = [
    {
      name: 'Cumplimiento menta',
      data: datosGrafico?.cumplimiento_mensual,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Administracion/ Indice cosumo linea"
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
        tituloBoton="Ingresar nuevas metas"
        handleCrear={handleOpenMeta}
        isDelete={false}
        isEdit={false}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Indice consumo insumos linea"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Cumplimiento meta"
          categories={labelCategorias}
          series={seriesDos}
          height={400}
          showToolbox
        />
      </div>
      <IndiceConsumoLineaModal
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
        titleChart="Indice consumo insumos linea"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              { name: 'Produccion', data: g.produccion ?? [] },
              {
                name: 'Consumo',
                data: g.consumo_mensual ?? [],
              },
            ],
          };
        }}
      />
    </>
  );
}
