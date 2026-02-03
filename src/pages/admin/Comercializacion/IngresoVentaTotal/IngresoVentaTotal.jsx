import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjPromedios,
  getObjsDesempenioMes,
  registerObjMetas,
} from '@service/Comercializacion/IngresoPorVentaTotal.services';
import ConfirmModal from '@components/ConfirmModal';
import IngresoVentaTotalModal from './IngresoVentaTotalModal';
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
  {
    label: 'Presupuesto mensual',
    key: 'presupuesto_mensual_prom',
  },
  {
    label: 'Venta mensual con otro ingresos',
    key: 'venta_mensual_con_otro_ingresos_prom',
  },
  {
    label: 'Venta mensual ceramica',
    key: 'venta_mensual_ceramica_prom',
  },
  {
    label: 'Otros ingresos',
    key: 'otros_ingresos_prom',
  },
  {
    label: 'Venta acumulada otros',
    key: 'venta_mensual_con_otro_ingresos_acumulado',
  },
  {
    label: 'Venta acumulada ceramica',
    key: 'venta_mensual_ceramica_acumulado',
  },
  {
    label: 'Presupuesto Acumulado',
    key: 'presupuesto_mensual_acumulado',
  },
  {
    label: 'Diferecincia entre ventas otros ingresos vs presupuesto',
    key: 'dif_otros_presupuesto',
  },
  {
    label: 'Diferecincia entre ventas ceramica vs presupuesto',
    key: 'dif_ceramico_presupuesto',
  },

  {
    label: 'Meta',
    key: 'meta',
  },
  {
    label: 'Cumplimiento mensual ceramica',
    key: 'cum_mensual_ceramica',
    render: (row) => normalizarPorcentaje(row.cum_mensual_ceramica),
  },
  {
    label: 'Cumplimiento otros ingresos vs presupuesto',
    key: 'cum_otros_ingreso',
    render: (row) => normalizarPorcentaje(row.cum_otros_ingreso),
  },
];

export default function IngresoVentaTotal() {
  const tableRef = useRef(null);
  const [datosGrafico, setDatosGrafica] = useState(null);
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
      name: 'Presupuesto mensual',
      data: datosGrafico?.presupuesto_mensual_prom,
    },
    {
      name: 'Venta mensual otros ingreso',
      data: datosGrafico?.venta_mensual_con_otro_ingresos_prom,
    },
    {
      name: 'Venta mensual ceramica',
      data: datosGrafico?.venta_mensual_ceramica_prom,
    },
    {
      name: 'Otros ingresos',
      data: datosGrafico?.otros_ingresos_prom,
    },
  ];

  const seriesTwo = [
    {
      name: 'Meta',
      data: datosGrafico?.meta,
    },
    {
      name: 'Cumplimiento mensual ceramica',
      data: datosGrafico?.cum_mensual_ceramica,
    },
    {
      name: 'Cumplimineto otros ingresos',
      data: datosGrafico?.cum_otros_ingreso,
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
          title="Ingreso venta total"
          categories={labelCategorias}
          series={series}
          height={400}
        />
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Cumplimiento"
          categories={labelCategorias}
          series={seriesTwo}
          height={400}
          showToolbox
        />
      </div>
      <IngresoVentaTotalModal
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
                name: 'V. m. otros ingreso',
                data: g?.venta_mensual_con_otro_ingresos,
              },
              {
                name: 'V. m. ceramica',
                data: g?.venta_mensual_ceramica,
              },
              {
                name: 'Otros ingresos',
                data: g?.otros_ingresos,
              },
            ],
          };
        }}
      />
    </>
  );
}
