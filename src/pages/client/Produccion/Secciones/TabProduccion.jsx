import { useState } from 'react';
import Tabs from '../../../../components/Tabs';
import Atomizado from './Tabs/Atomizado';
import Barbotina from './Tabs/Barbotina';
import Prensado from './Tabs/Prensado';
import Esmalte from './Tabs/Esmalte';
import Serigrafia from './Tabs/Serigrafia';
import Seleccion from './Tabs/Seleccion';

const tabs = [
  { key: 'general', label: 'General' },
  { key: 'barbotina', label: 'Barbotina' },
  { key: 'atomizado', label: 'Atomizado' },
  { key: 'prensado', label: 'Prensado' },
  { key: 'esmalte', label: 'Esmalte' },
  { key: 'serigrafia', label: 'Serigrafia' },
  { key: 'seleccion', label: 'Seleccion' },
];

export default function PlanillaProduccion() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'general' && <div>Contenido General</div>}
        {tab === 'barbotina' && <Barbotina />}
        {tab === 'atomizado' && <Atomizado />}
        {tab === 'prensado' && <Prensado />}
        {tab === 'esmalte' && <Esmalte />}
        {tab === 'serigrafia' && <Serigrafia />}
        {tab === 'seleccion' && <Seleccion />}
      </div>
    </div>
  );
}
