import TablaRetutilizable from '../../../../../components/TablaReutilizable';
import {
  registerObjMetas,
  getObjPromedios,
  getObjsDesempenioMes,
} from '../../../../../service/Produccion/Administracion/IndiceConsumoAgua.services';
import ConfirmModal from '../../../../../components/ConfirmModal';
import IndiceConsumoAguaModal from './IndiceConsumoAguaModal';
import ModalDesempeñoMes from './ModalDesempeñoMes';
import GraficoBarChart from '@components/GraficoBarChart';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { periodoATexto } from '../../../../../helpers/normalze.helpers';

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
    label: 'Consumo agua',
    key: 'consumo_agua',
  },
  {
    label: 'Cisterna agua',
    key: 'cisterna_agua_prom',
  },
  {
    label: 'Medidor subestacion ee',
    key: 'medidor_subestacion_ee_prom',
  },
  {
    label: 'Medidor tres produccion',
    key: 'medidor_tres_produccion_prom',
  },
  {
    label: 'Medidor cuatro eliza',
    key: 'medidor_cuatro_eliza_prom',
  },

  {
    label: 'Medidor cinco administracion',
    key: 'medidor_cinco_administracion_prom',
  },
  {
    label: 'Medidor seis arcilla',
    key: 'medidor_seis_arcilla_prom',
  },
  {
    label: 'Produccion acumulada',
    key: 'produccion_acumulado',
  },
  {
    label: 'Consumo agua acumulado',
    key: 'consumo_agua_acumulado',
  },
  {
    label: 'Indice consumo agua',
    key: 'indice_consumo_agua',
  },
  {
    label: 'Indice consumo agua acumulado',
    key: 'indice_consumo_agua_acumulado',
  },
  {
    label: 'Cumplimiento [%]',
    key: 'cumplimiento',
  },
  {
    label: 'Meta',
    key: 'meta',
  },
];

export default function Calidad() {
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  const [datosGrafico, setDatosGrafica] = useState(null);

  //Cambar meta
  const [openMeta, setOpenMeta] = useState(false);
  const [openMetaConfirm, setOpenMetaConfirm] = useState(false);
  const [payloadMeta, setPayloadMeta] = useState({});
  //
  //Detalles
  const [openDetalles, setOpenDetalles] = useState(false);
  const [idRow, setIdRow] = useState(null);
  //
  //Detalles

  const handleOpenDetalles = (id) => {
    setIdRow(id);
    setOpenDetalles(true);
  };

  const handleCloseDetalles = () => {
    setOpenDetalles(false);
    setIdRow(null);
  };
  //Metaa
  const handleOpenCreateMeta = () => {
    setOpenMeta(true);
  };
  const handleOpenConfirmCreate = (data) => {
    setPayloadMeta(data);
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
    { name: 'Cisterna agua', data: datosGrafico?.cisterna_agua_prom ?? [] },
    {
      name: 'Subestacion ee',
      data: datosGrafico?.medidor_subestacion_ee_prom ?? [],
    },
    {
      name: 'Medidor #3 Produccion',
      data: datosGrafico?.medidor_tres_produccion_prom ?? [],
    },
    {
      name: 'Medidor #4 Eliza',
      data: datosGrafico?.medidor_cuatro_eliza_prom ?? [],
    },
    {
      name: 'Medidor #5 Administracion',
      data: datosGrafico?.medidor_cinco_administracion_prom ?? [],
    },
    {
      name: 'Medidor #6 Arcilla',
      data: datosGrafico?.medidor_seis_arcilla_prom ?? [],
    },
  ];

  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjPromedios}
        titulo="Produccion/ Administracion/ Indice cosumo agua"
        datosBusqueda={['periodo']}
        columnas={columnas}
        handleDetail={handleOpenDetalles}
        isDelete={false}
        isEdit={false}
        botonCrear={true}
        tituloBoton="Cambiar meta"
        handleCrear={handleOpenCreateMeta}
        isGrafica={true}
        setDatosGrafico={setDatosGrafica}
      />
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <GraficoBarChart
          title="Consumo de agua por medido M3"
          categories={labelCategorias}
          series={series}
          height={400}
          showToolbox
        />
      </div>
      <ModalDesempeñoMes
        open={openDetalles}
        fetchById={getObjsDesempenioMes}
        id={idRow}
        onClose={handleCloseDetalles}
      />

      <IndiceConsumoAguaModal
        open={openMeta}
        onClose={() => setOpenMeta(false)}
        onSave={handleOpenConfirmCreate}
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
    </>
  );
}
