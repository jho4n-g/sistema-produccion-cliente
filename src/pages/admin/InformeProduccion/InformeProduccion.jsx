import TablaRetutilizable from '@components/TablaReutilizable';
import {
  getObjs,
  getIdObj,
} from '@service/Produccion/Secciones/DiaInforme.services';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import InformeProduccionModal from './InformeProduccionModal';

const columnas = [{ label: 'Fecha', key: 'fecha' }];

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
        datosBusqueda={['periodo']}
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
