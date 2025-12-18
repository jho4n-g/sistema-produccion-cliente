import { useState } from 'react';
import Tabs from '../../../components/Tabs';
import Atomizado from './Secciones/Atomizado';
import Barbotina from './Secciones/Barbotina';
import Prensado from './Secciones/Prensado';
import Esmalte from './Secciones/Esmalte';

const tabs = [
  { key: 'general', label: 'General' },
  { key: 'atomizado', label: 'Atomizado' },
  { key: 'barbotina', label: 'Barbotina' },
  { key: 'prensado', label: 'Prensado' },
  { key: 'esmalte', label: 'Esmalte' },
  { key: 'observaciones', label: 'Observaciones' },
];

export default function PlanillaProduccion() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'general' && <div>Contenido General</div>}
        {tab === 'atomizado' && <Atomizado />}
        {tab === 'barbotina' && <Barbotina />}
        {tab === 'prensado' && <Prensado />}
        {tab === 'esmalte' && <Esmalte />}
        {tab === 'observaciones' && <div>Contenido Observaciones</div>}
      </div>
    </div>
  );
}
