import TablaRetutilizable from '@components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '@service/Produccion/Administracion/IndiceConsumoGn.services';
import ConfirmModal from '@components/ConfirmModal';
import IndiceConsumoGnModal from './IndiceConsumoGnModal';
import ModalChartDesempenio from '@components/ModalChartDesempenio';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';
import { periodoATexto, normalizarPorcentaje } from '@helpers/normalze.helpers';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'Produccion [m²]',
    key: 'produccion_prom',
  },
  {
    label: 'Consumo gas natural [pc]',
    key: 'consumo_gas_natural_prom',
  },
  {
    label: 'Produccion acumulada [m²]',
    key: 'produccion_acumulado',
  },
  {
    label: 'Consumo gas acumulado [PC]',
    key: 'consumo_gas_acumulado',
  },
  {
    label: 'Indice consumo GN [pc/m²]',
    key: 'indice_consumo',
  },
  {
    label: 'Indice consumo GN acumulado [pc/m²]',
    key: 'indice_consumo_acumulado',
  },
  {
    label: 'Meta [pc/m²]',
    key: 'meta_pc_m',
  },
  {
    label: '% Cumplimiento acumulado',
    key: 'cumplimiento_acumulado',
    render: (row) => normalizarPorcentaje(row.cumplimiento_acumulado ?? 0),
  },

  {
    label: '% Meta',
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
    { name: 'Indice consumo', data: datosGrafico?.indice_consumo ?? [] },
    {
      name: 'Indice consumo acumulado',
      data: datosGrafico?.indice_consumo_acumulado ?? [],
    },
  ];

  const seriesDos = [
    { name: 'Consumo gas', data: datosGrafico?.consumo_gas_natural ?? [] },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Administracion/ Indice cosumo gn"
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
          title="Indice consumo gas"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Consumo gas"
          categories={labelCategorias}
          series={seriesDos}
          height={400}
          showToolbox
        />
      </div>
      <IndiceConsumoGnModal
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
        titleChart="Indice consumo gas"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              { name: 'Produccion', data: g.produccion ?? [] },
              {
                name: 'Consumo gas natural',
                data: g.consumo_gas_natural ?? [],
              },
            ],
          };
        }}
      />
    </>
  );
}
