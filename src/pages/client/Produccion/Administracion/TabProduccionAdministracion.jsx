import { useState } from 'react';
import Tabs from '../../../../components/Tabs';
import Calidad from './Tabs/Calidad/Calidad';
import IndiceConsumoAguaLlenado from './Tabs/IndiceConsumoAgua/IndiceConsumoAgua';
import IndiceConsumoBasesLlenado from './Tabs/IndiceConsumoBases/IndiceConsumoBases';
import IndiceConsumoEeLlenado from './Tabs/IndiceConsumoEe/IndiceConsumoEe';
import IndiceConsumoEngobleLlenado from './Tabs/IndiceConsumoEngobe/IndiceConsumoEngobe';
import IndiceConsumoEsmalteLlenado from './Tabs/IndiceConsumoEsmalte/IndiceConsumoEsmalte';
import IndiceConsumoGnLlenado from './Tabs/IndiceConsumoGn/IndiceConsumoGn';
import IndiceConsumoLineaLlenado from './Tabs/IndiceConsumoLinea/IndiceConsumoLinea';
import IndicePolvoAtomizadoLlenado from './Tabs/IndicePolvoAtomizao/IndicePolvoAtomizado';
import MonitoreoGasesCombustionLlenado from './Tabs/MonitoreoGasesCombustion/MonitoreoGasesCombustion';
import ProduccionLlenado from './Tabs/Produccion/Produccion';

const tabs = [
  { key: 'general', label: 'General' },
  { key: 'calidad', label: 'Calidad' },
  { key: 'indiceConsumoAgua', label: 'Indice consumo agua' },
  { key: 'indiceConsumoBases', label: 'Indice consumo bases' },
  { key: 'indiceConsumoEe', label: 'Indice consumo ee' },
  { key: 'indiceConsumoEngobe', label: 'Indice consumo engobe' },
  { key: 'indiceConsumoEsmalte', label: 'Indice consumo esmalte' },
  { key: 'indiceConsumoGn', label: 'Indice consumo gn' },
  { key: 'indiceConsumoLinea', label: 'Indice consumo linea' },
  { key: 'indicePolvoAtomizado', label: 'Indice polvo atomizado' },
  { key: 'monitoreoGasesCombustion', label: 'Monitoreo gases combustion' },
  { key: 'produccion', label: 'Produccion' },
];

export default function TabProduccionAdministracion() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'general' && <div>Contenido General</div>}
        {tab === 'calidad' && <Calidad />}
        {tab === 'indiceConsumoAgua' && <IndiceConsumoAguaLlenado />}
        {tab === 'indiceConsumoBases' && <IndiceConsumoBasesLlenado />}
        {tab === 'indiceConsumoEe' && <IndiceConsumoEeLlenado />}
        {tab === 'indiceConsumoEngobe' && <IndiceConsumoEngobleLlenado />}
        {tab === 'indiceConsumoEsmalte' && <IndiceConsumoEsmalteLlenado />}
        {tab === 'indiceConsumoGn' && <IndiceConsumoGnLlenado />}
        {tab === 'indiceConsumoLinea' && <IndiceConsumoLineaLlenado />}
        {tab === 'indicePolvoAtomizado' && <IndicePolvoAtomizadoLlenado />}
        {tab === 'monitoreoGasesCombustion' && (
          <MonitoreoGasesCombustionLlenado />
        )}
        {tab === 'produccion' && <ProduccionLlenado />}
      </div>
    </div>
  );
}
