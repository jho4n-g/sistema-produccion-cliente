import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjPromedios,
  getObjsDesempenioMes,
  registerObjMetas,
} from '@service/Comercializacion/VentaTotal.services';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import VentaTotalModal from './VentaTotalModal';
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
    label: 'Venta mensual',
    key: 'venta_mensual_prom',
  },
  {
    label: 'Diferencia venta mensual vs presupuesto',
    key: 'dif_venta_presupuesto',
  },
  {
    label: 'Venta mensual acumulado',
    key: 'venta_acumulada',
  },
  {
    label: 'Presupuesto mensual acumualdo',
    key: 'presupuesto_acumulado',
  },
  {
    label: 'Diferencia venta mensual vs presupuesto acumualdo',
    key: 'dif_venta_presupuesto_acumulado',
  },
  {
    label: 'meta',
    key: 'meta',
  },
  {
    label: 'Cumplimiento mensual',
    key: 'cum_mensual',
  },
  {
    label: 'Cumplimiento acumulado',
    key: 'cum_acumulado',
  },
];

export default function VentaTotal() {
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

  const labelCategorias = datosGrafico?.categories ?? [];

  const series = [
    {
      name: 'Venta mensual acumulada',
      data: datosGrafico?.venta_acumulada ?? [],
    },
    {
      name: 'Presupuesto mensual acumulado',
      data: datosGrafico?.presupuesto_acumulado ?? [],
    },
  ];

  const seriesTwo = [
    {
      name: 'Meta',
      data: datosGrafico?.meta ?? [],
    },
    {
      name: 'Cumplimiento',
      data: datosGrafico?.cum_mensual ?? [],
    },
    {
      name: 'Cumplimiento acumulado',
      data: datosGrafico?.cum_acumulado ?? [],
    },
  ];
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Administracion/ Ventas total"
        datosBusqueda={['periodo']}
        columnas={columnas}
        isDetalle={true}
        handleDetail={handleOpenDetalles}
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
          title="Ventas"
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
          series={seriesTwo}
          height={400}
          showToolbox
        />
      </div>
      <VentaTotalModal
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
                name: 'Venta mensual',
                data: g?.venta_mensual,
              },
            ],
          };
        }}
      />
    </>
  );
}
