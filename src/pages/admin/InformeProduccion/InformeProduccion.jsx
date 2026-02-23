import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjs,
  getIdObj,
} from '@service/Produccion/Secciones/DiaInforme.services';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import InformeProduccionModal from './InformeProduccionModal';
import { normalizarFecha } from '@helpers/normalze.helpers';

const columnas = [
  { label: 'Fecha', key: 'fecha', render: (row) => normalizarFecha(row.fecha) },
];

export default function InformeProduccion() {
  const tableRef = useRef(null);

  const [idRow, setIdRow] = useState(null);
  const [OpenViewModal, setOpenViewModal] = useState(false);

  const hanldeView = (id) => {
    setIdRow(id);
    setOpenViewModal(true);
  };
  return (
    <>
      <TablaRetutilizable
        ref={tableRef}
        getObj={getObjs}
        titulo="Produccion/ Informe Produccion"
        datosBusqueda={['fecha']}
        columnas={columnas}
        handleDetail={hanldeView}
        handleEdit={{}}
        hanldeDelete={{}}
        enableHorizontalScroll={false}
        isEdit={false}
        isDelete={false}
      />
      <InformeProduccionModal
        title="Infome de produccion"
        open={OpenViewModal}
        onClose={() => setOpenViewModal(false)}
        onSave={{}}
        fetchById={getIdObj}
        id={idRow}
      />
    </>
  );
}
