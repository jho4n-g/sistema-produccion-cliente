import TablaRetutilizable from '../../../../components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '../../../../service/Administracion/HorasExtra.services';
import ConfirmModal from '../../../../components/ConfirmModal';
import HoraExtraModal from './HoraExtraModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import GraficoBarChart from '@components/GraficoBarChart';
import {
  periodoATexto,
  normalizarPorcentaje,
} from '../../../../helpers/normalze.helpers';
import ModalChartDesempenio from '@components/ModalChartDesempenio';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  { label: 'adm', key: 'adm_prom' },
  { label: 'prd', key: 'prd_prom' },
  {
    label: 'mantto',
    key: 'mantto_prom',
  },
  {
    label: 'ampliacion',
    key: 'ampliacion_prom',
  },
  {
    label: 'Cc',
    key: 'cc_prom',
  },
  {
    label: 'Seg ind',
    key: 'seg_ind_prom',
  },
  {
    label: 'Region centro',
    key: 'r_centro_prom',
  },

  {
    label: 'Region oeste',
    key: 'r_oeste_prom',
  },
  {
    label: 'Region este',
    key: 'r_este_prom',
  },
  {
    label: 'Region fabr',
    key: 'r_fabr_prom',
  },
  {
    label: 'Total personas',
    key: 'total_personas_prom',
  },
  {
    label: 'Horas extra total',
    key: 'horas_extra_total',
  },
  {
    label: 'Indice horas extra',
    key: 'indice_horas_extra',
  },
  {
    label: 'Indice horas extra acumulado',
    key: 'indice_horas_extra_acumulado',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
  {
    label: 'Cumplimineto meta',
    key: 'cumplimiento_meta',
    render: (row) => normalizarPorcentaje(row.cumplimiento_meta),
  },
];

export default function HorasExtra() {
  const [datosGrafico, setDatosGrafica] = useState(null);
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
      name: 'Adm',
      data: datosGrafico?.adm_prom,
    },
    {
      name: 'Prd',
      data: datosGrafico?.prd_prom,
    },
    {
      name: 'Mantto',
      data: datosGrafico?.mantto_prom,
    },
    {
      name: 'Ampliacion',
      data: datosGrafico?.ampliacion_prom,
    },
    {
      name: 'Cc',
      data: datosGrafico?.cc_prom,
    },
    {
      name: 'Seg ind',
      data: datosGrafico?.seg_ind_prom,
    },
    {
      name: 'Region centro',
      data: datosGrafico?.r_centro_prom,
    },
    {
      name: 'Region oeste',
      data: datosGrafico?.r_oeste_prom,
    },
    {
      name: 'Region este',
      data: datosGrafico?.r_este_prom,
    },
    {
      name: 'Region fabr',
      data: datosGrafico?.r_fabr_prom,
    },
    {
      name: 'Horas extra total',
      data: datosGrafico?.horas_extra_total,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Control de proceso de seleccion y embalaje"
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
        <GraficoBarChart
          title="Hora extra por areas"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <HoraExtraModal
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
                name: 'Adm',
                data: g?.adm ?? [],
              },
              {
                name: 'Prd',
                data: g?.prd,
              },
              {
                name: 'Mantto',
                data: g?.mantto,
              },
              {
                name: 'Ampliacion',
                data: g?.ampliacion,
              },
              {
                name: 'Cc',
                data: g?.cc,
              },
              {
                name: 'Seg ind',
                data: g?.seg_ind,
              },
              {
                name: 'Region centro',
                data: g?.r_centro,
              },
              {
                name: 'Region oeste',
                data: g?.r_oeste,
              },
              {
                name: 'Region este',
                data: g?.r_este,
              },
              {
                name: 'Region fabr',
                data: g?.r_fabr,
              },
            ],
          };
        }}
      />
    </>
  );
}
