import { useState } from 'react';
import Tabs from '../../../../../components/Tabs';
import SerigrafiadoAdmin from './Tabs/Serigrafia';
import SerigrafiadoCliente from '../../../../client/Produccion/Secciones/Serigrafia';

const tabs = [
  { key: 'tabla', label: 'Tabla' },
  { key: 'llenado', label: 'Llenado' },
  { key: 'resumen', label: 'Resumen' },
];

export default function TabBarbotinaAdmin() {
  const [tab, setTab] = useState('tabla');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'tabla' && <SerigrafiadoAdmin />}
        {tab === 'llenado' && <SerigrafiadoCliente />}
        {tab === 'resumen' && <di>Resumen</di>}
      </div>
    </div>
  );
}
