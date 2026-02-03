import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  getObjPromedios,
  getObjsDesempenioMes,
} from '../../../../service/Administracion/GeneracionResiduos.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import GeneracionResiduosModal from './GeneracionResiduosModal';
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
  { label: 'N trabajadores', key: 'n_trabajadores_prom' },
  { label: 'Kg carton', key: 'kg_carton_prom' },
  {
    label: 'Pe',
    key: 'pe_prom',
  },
  {
    label: 'Kg strechfilm',
    key: 'kg_strechfilm_prom',
  },
  {
    label: 'Kg bolsas bigbag',
    key: 'kg_bolsas_bigbag_prom',
  },
  {
    label: 'Kg turriles plasticos',
    key: 'kg_turriles_plasticos_prom',
  },
  {
    label: 'Kg envase mil litros',
    key: 'kg_envase_mil_litros_prom',
  },

  {
    label: 'Sunchu kg',
    key: 'sunchu_kg_prom',
  },
  {
    label: 'Kg madera',
    key: 'kg_madera_prom',
  },
  {
    label: 'Kg bidon azul',
    key: 'kg_bidon_azul_prom',
  },
  {
    label: 'Kg aceite sucio',
    key: 'kg_aceite_sucio_prom',
  },
  {
    label: 'Kg bolsas plasticas transparentes',
    key: 'kg_bolsas_plasticas_transparentes_prom',
  },
  {
    label: 'Kg bolsas yute',
    key: 'kg_bolsas_yute_prom',
  },
  {
    label: 'Total residuos',
    key: 'total_residuos',
  },
  {
    label: 'Indice residuos',
    key: 'indice_residuos',
  },
];

export default function GeneracionResiduos() {
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
      name: 'N trabajadoresdm',
      data: datosGrafico?.n_trabajadores_prom,
    },
    {
      name: 'Kg carton',
      data: datosGrafico?.kg_carton_prom,
    },
    {
      name: 'Pe',
      data: datosGrafico?.pe_prom,
    },
    {
      name: 'Kg strechfilm',
      data: datosGrafico?.kg_strechfilm_prom,
    },
    {
      name: 'Kg bolsas bigbag',
      data: datosGrafico?.kg_bolsas_bigbag_prom,
    },
    {
      name: 'Kg turriles plasticos',
      data: datosGrafico?.kg_turriles_plasticos_prom,
    },
    {
      name: 'Kg envase mil litros',
      data: datosGrafico?.kg_envase_mil_litros_prom,
    },
    {
      name: 'Kg sunchu',
      data: datosGrafico?.sunchu_kg_prom,
    },
    {
      name: 'Kg madera',
      data: datosGrafico?.kg_madera_prom,
    },
    {
      name: 'Kg bidon azul',
      data: datosGrafico?.kg_bidon_azul_prom,
    },
    {
      name: 'Kg aceite sucio',
      data: datosGrafico?.kg_aceite_sucio_prom,
    },
    {
      name: 'Kg bolsas transparentes',
      data: datosGrafico?.kg_bolsas_plasticas_transparentes_prom,
    },
    {
      name: 'Kg bolsas yute',
      data: datosGrafico?.kg_bolsas_yute_prom,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Generacion de residuos solidos"
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
          title="Hora extra por areas"
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
        titleChart="Generacion de residuos solidos"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              {
                name: 'N trabajadoresdm',
                data: g?.n_trabajadores,
              },
              {
                name: 'Kg carton',
                data: g?.kg_carton,
              },
              {
                name: 'Pe',
                data: g?.pe,
              },
              {
                name: 'Kg strechfilm',
                data: g?.kg_strechfilm,
              },
              {
                name: 'Kg bolsas bigbag',
                data: g?.kg_bolsas_bigbag,
              },
              {
                name: 'Kg turriles plasticos',
                data: g?.kg_turriles_plasticos,
              },
              {
                name: 'Kg envase mil litros',
                data: g?.kg_envase_mil_litros,
              },
              {
                name: 'Kg sunchu',
                data: g?.sunchu_kg,
              },
              {
                name: 'Kg madera',
                data: g?.kg_madera,
              },
              {
                name: 'Kg bidon azul',
                data: g?.kg_bidon_azul,
              },
              {
                name: 'Kg aceite sucio',
                data: g?.kg_aceite_sucio,
              },
              {
                name: 'Kg bolsas transparentes',
                data: g?.kg_bolsas_plasticas_transparentes,
              },
              {
                name: 'Kg bolsas yute',
                data: g?.kg_bolsas_yute,
              },
            ],
          };
        }}
      />
    </>
  );
}
