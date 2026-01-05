import { useState } from 'react';
import Tabs from '@components/Tabs';
import DisponibilidadPorLineaLlenado from './Tabs/DisponibilidadPorLineaLlenado';

const tabs = [
  { key: 'general', label: 'General' },
  { key: 'DisponibilidadPorLineaLlenado', label: 'Desponibilidad por linea' },
];

export default function PlanillaProduccion() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'general' && <div>Contenido General</div>}
        {tab === 'DisponibilidadPorLineaLlenado' && (
          <DisponibilidadPorLineaLlenado />
        )}
      </div>
    </div>
  );
}
