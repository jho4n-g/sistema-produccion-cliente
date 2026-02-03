import TablaRetutilizable from '@components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '@service/Produccion/Administracion/MonitoreGasesCombustion.services';
import ConfirmModal from '@components/ConfirmModal';
import MonitoreoGasesCombustionModal from './MonitoreoGasesCombustionModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { periodoATexto } from '@helpers/normalze.helpers';
import ModalChartDesempenio from '@components/ModalChartDesempenio';
import GraficoBarChart from '@components/GraficoBarChart';

const columnas = [
  {
    label: 'Periodo',
    key: 'periodo',
    render: (row) => periodoATexto(row.periodo),
  },
  {
    label: 'Horno b ',
    key: 'horno_b_prom',
  },
  {
    label: 'Horno c',
    key: 'horno_c_prom',
  },
  {
    label: 'Horno d',
    key: 'horno_d_prom',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
];

export default function IndiceConsumoLinea() {
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
      name: 'Horno B',
      data: datosGrafico?.horno_b,
    },
    {
      name: 'Horno c',
      data: datosGrafico?.horno_c,
    },
    {
      name: 'Horno D',
      data: datosGrafico?.horno_d,
    },
  ];

  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Administracion/ Monitoreo gases combustion"
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
        <GraficoBarChart
          title="Monoxido de carbono"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>

      <MonitoreoGasesCombustionModal
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
              { name: 'Horno B', data: g.horno_b ?? [] },
              {
                name: 'Horno C',
                data: g.horno_c ?? [],
              },
              {
                name: 'Horno D',
                data: g.horno_d ?? [],
              },
            ],
          };
        }}
      />
    </>
  );
}
