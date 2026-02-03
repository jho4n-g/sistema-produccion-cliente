import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  getObjPromedios,
  getObjsDesempenioMes,
} from '../../../../service/Administracion/Donaciones.services';
import { useState, useRef } from 'react';
import GraficoBarChart from '@components/GraficoBarChart';
import { periodoATexto } from '../../../../helpers/normalze.helpers';
import ModalChartDesempenio from '@components/ModalChartDesempenio';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'Produccion menual',
    key: 'produccion_mensual_prom',
  },
  { label: 'Cascote mensual', key: 'cascote_mensual_prom' },
  {
    label: 'Donacion',
    key: 'donacion_prom',
  },
  {
    label: 'Produccion acumulado',
    key: 'produccion_acumulada',
  },
  { label: 'Cascote acumulado', key: 'cascote_acumulado' },

  { label: 'Donacion acumulado', key: 'donacion_acumulada' },
  { label: ' Donacion / Produccion', key: 'donacion_mensual_cascote' },
  { label: ' Cascote / Produccion', key: 'cascote_mensual_cascote' },
  { label: ' Costo promedio donacion', key: 'costo_promedio_donacion' },
];

export default function Donaciones() {
  const tableRef = useRef(null);

  const [datosGrafico, setDatosGrafica] = useState(null);
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

  const labelCategorias = (datosGrafico?.categories ?? []).map((row) =>
    periodoATexto(row),
  );

  const series = [
    {
      name: 'Produccion mensual',
      data: datosGrafico?.produccion_mensual_prom,
    },
    {
      name: 'Cascote mensual',
      data: datosGrafico?.cascote_mensual_prom,
    },
    {
      name: 'Donacion',
      data: datosGrafico?.donacion_prom,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Administracion/ Indice no conformidad y acciones correctivas"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={handleOpenDetalles}
        isDetalle={true}
        handleEdit={() => {}}
        hanldeDelete={() => {}}
        enableHorizontalScroll={false}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
        botonCrear={false}
        tituloBoton="Ingresar nuevo periodo"
        handleCrear={() => {}}
        isDelete={false}
        isEdit={false}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Donaciones"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
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
                name: 'Produccion mensual',
                data: g?.produccion_mensual,
              },
              {
                name: 'Cascote mensual',
                data: g?.cascote_mensual,
              },
              {
                name: 'Donacion',
                data: g?.donacion,
              },
            ],
          };
        }}
      />
    </>
  );
}
