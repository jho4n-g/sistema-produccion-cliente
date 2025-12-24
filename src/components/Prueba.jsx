import React, { useMemo, useState } from 'react';

export default function PageTabsDemo() {
  const tabs = useMemo(
    () => [
      {
        key: 'resumen',
        label: 'Resumen',
        badge: 'Nuevo',
        content: (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Resumen</h3>
            <p className="text-slate-600">
              Aquí puedes mostrar métricas, cards, estados o información
              general.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <Card title="Citas" value="128" />
              <Card title="Pendientes" value="14" />
              <Card title="Atendidas" value="92" />
            </div>
          </div>
        ),
      },
      {
        key: 'medicos',
        label: 'Médicos',
        content: (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Médicos</h3>
            <p className="text-slate-600">
              Lista, filtros, y acciones para administrar médicos.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                  placeholder="Buscar médico..."
                  className="w-full md:w-80 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                />
                <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  + Nuevo médico
                </button>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'especialidades',
        label: 'Especialidades',
        content: (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Especialidades
            </h3>
            <p className="text-slate-600">
              Configura especialidades, estados y asignaciones.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <MiniItem name="Medicina General" desc="Activa" />
              <MiniItem name="Pediatría" desc="Activa" />
              <MiniItem name="Traumatología" desc="Activa" />
              <MiniItem name="Odontología" desc="Activa" />
            </div>
          </div>
        ),
      },
      {
        key: 'config',
        label: 'Configuración',
        content: (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Configuración
            </h3>
            <p className="text-slate-600">
              Ajustes generales del módulo (horarios, límites, etc.).
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Límite citas por grupo" placeholder="Ej. 1" />
                <Field label="Rango días visibles" placeholder="Ej. 2" />
                <div className="md:col-span-2 flex justify-end">
                  <button className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const [active, setActive] = useState(tabs[0].key);
  const activeIdx = tabs.findIndex((t) => t.key === active);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header “tipo página” */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Administración
          </h1>
          <p className="text-slate-600">
            Gestiona módulos con pestañas limpias y estilo de página.
          </p>
        </div>

        {/* Contenedor principal */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Tabs */}
          <div className="border-b border-slate-200">
            <div className="relative flex flex-wrap gap-2 px-3 pt-3 md:px-6 md:pt-5">
              {tabs.map((t) => {
                const isActive = t.key === active;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActive(t.key)}
                    className={[
                      'relative rounded-2xl px-4 py-2 text-sm font-semibold transition',
                      isActive
                        ? 'text-slate-900'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2">
                      {t.label}
                      {t.badge ? (
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white">
                          {t.badge}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}

              {/* Indicador inferior animado (simple y bonito) */}
              <div className="w-full" />
              <div className="relative h-1 w-full">
                <div className="absolute inset-0 bg-transparent" />
                <div
                  className="absolute left-0 top-0 h-1 rounded-full bg-slate-900 transition-all"
                  style={{
                    width: calcIndicatorWidth(tabs),
                    transform: `translateX(${calcIndicatorOffset(
                      tabs,
                      activeIdx
                    )}px)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 md:p-6">{tabs[activeIdx]?.content}</div>
        </div>
      </div>
    </div>
  );
}

/** Helpers del indicador (sencillos, basados en un ancho aproximado por tab)
 *  Si quieres 100% exacto por DOM, te paso la versión con refs.
 */
function calcIndicatorWidth(tabs) {
  // ancho aproximado: label * 8 + padding. Ajusta si quieres.
  const avg = tabs.length ? Math.min(220, Math.max(90, 120)) : 120;
  return avg;
}
function calcIndicatorOffset(tabs, idx) {
  // offset aproximado por índice (asumiendo anchos similares)
  const w = calcIndicatorWidth(tabs);
  const gap = 8; // gap-2 aprox
  return idx * (w + gap);
}

function Card({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm font-semibold text-slate-700">{title}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function MiniItem({ name, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-900">{name}</div>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
          {desc}
        </span>
      </div>
    </div>
  );
}

function Field({ label, placeholder }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-semibold text-slate-700">{label}</div>
      <input
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
      />
    </label>
  );
}
