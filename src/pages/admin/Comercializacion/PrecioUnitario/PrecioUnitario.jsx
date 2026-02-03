import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjPromedios,
  getObjsDesempenioMes,
  registerObjMetas,
} from '@service/Comercializacion/PrecioUnitario.services';
import ConfirmModal from '@components/ConfirmModal';
import PrecioUnitarioModal from './PrecioUnitarioModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
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
    label: 'Presupuesto mensual',
    key: 'presupuesto_mensual_prom',
  },
  {
    label: 'Precio promedio',
    key: 'precio_promedio_prom',
  },
  {
    label: 'Region centro',
    key: 'region_centro_prom',
  },
  {
    label: 'Region este',
    key: 'region_este_prom',
  },
  {
    label: 'Region oeste',
    key: 'region_oeste_prom',
  },
  {
    label: 'Fabrica',
    key: 'fabrica_prom',
  },
  {
    label: 'Exportacion',
    key: 'exportacion_prom',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
  {
    label: 'Cumplimiento mensual',
    key: 'cumplimiento_mensual',
  },
];

export default function PrecioUnitario() {
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
      name: 'Presupuesto mensual',
      data: datosGrafico?.presupuesto_mensual_prom,
    },
    {
      name: 'Precio promedio',
      data: datosGrafico?.precio_promedio_prom,
    },
    {
      name: 'Region centro',
      data: datosGrafico?.region_centro_prom,
    },
    {
      name: 'Region este',
      data: datosGrafico?.region_este_prom,
    },
    {
      name: 'Region oeste',
      data: datosGrafico?.region_oeste_prom,
    },
    {
      name: 'Fabrica',
      data: datosGrafico?.fabrica_prom,
    },
    {
      name: 'Exportacion',
      data: datosGrafico?.exportacion_prom,
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Administracion/ Ingreso ventas total"
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
          title="Precio unitario"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <PrecioUnitarioModal
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
        titleChart="Ingreso venta total"
        mapResponseToChart={(resp) => {
          const g = resp?.datos?.datoGrafico ?? {};
          return {
            categories: g.categories ?? [],
            series: [
              {
                name: 'Presupuesto mensual',
                data: g?.presupuesto_mensual,
              },
              {
                name: 'Precio promedio',
                data: g?.precio_promedio,
              },
              {
                name: 'Region centro',
                data: g?.region_centro,
              },
              {
                name: 'Region este',
                data: g?.region_este,
              },
              {
                name: 'Region oeste',
                data: g?.region_oeste,
              },
              {
                name: 'Fabrica',
                data: g?.fabrica,
              },
              {
                name: 'Exportacion',
                data: g?.exportacion,
              },
            ],
          };
        }}
      />
    </>
  );
}
