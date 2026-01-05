import { useState } from 'react';
import Tabs from '@components/Tabs';
import IngresoPorVentaTotalLlendo from './Tabs/IngresoPorVentaTotalLlendo';
import VentaTotalLlenado from './Tabs/VentaTotalLlenado';
import PrecioUnitarioLlenado from './Tabs/PrecioUnitarioLlenado';

const tabs = [
  { key: 'general', label: 'General' },
  { key: 'IngresoPorVentaTotalLlendo', label: 'Ingreso por venta total' },
  { key: 'VentaTotalLlenado', label: 'Venta total' },
  { key: 'PrecioUnitarioLlenado', label: 'Precio unitario' },
];

export default function PlanillaProduccion() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'general' && <div>Contenido General</div>}
        {tab === 'IngresoPorVentaTotalLlendo' && <IngresoPorVentaTotalLlendo />}
        {tab === 'VentaTotalLlenado' && <VentaTotalLlenado />}
        {tab === 'PrecioUnitarioLlenado' && <PrecioUnitarioLlenado />}
      </div>
    </div>
  );
}
