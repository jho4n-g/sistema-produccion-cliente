import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import LogoCeramica from '../../img/logo-ceramica-coboce.png';

import Novedades from './TiposDocumentos/Novedades';
import { getDocumentos } from '../../service/Documentos/General';
import { getDocumentsNovedades } from '../../service/Documentos/Novedades';
import { getDocumentsPolitica } from '../../service/Documentos/Politica';
import { getDocumentsProcedimiento } from '../../service/Documentos/Procedimientos';

// debounce simple sin librerías
function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function DocumentManagerPageTW() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // ✅ leer estado desde URL (si no hay, defaults)
  const [activeTab, setActiveTab] = useState(params.get('tab') || 'novedades');
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '');
  const [area, setArea] = useState(params.get('area') || 'Comercial');

  const debouncedQuery = useDebouncedValue(searchQuery, 350);

  // ✅ config central (1 solo lugar)
  const tabsConfig = useMemo(
    () => ({
      novedades: {
        label: 'Novedades',
        title: 'Novedades',
        fetcher: getDocumentos,
      },
      politicas: {
        label: 'Políticas',
        title: 'Políticas',
        fetcher: getDocumentsPolitica,
      },
      procedimientos: {
        label: 'Procesos',
        title: 'Procesos',
        fetcher: getDocumentsProcedimiento,
      },
      boletines: {
        label: 'Boletines',
        title: 'Boletines',
        fetcher: getDocumentsNovedades,
      },
    }),
    []
  );

  const tabs = useMemo(
    () =>
      Object.entries(tabsConfig).map(([key, v]) => ({ key, label: v.label })),
    [tabsConfig]
  );

  const current = tabsConfig[activeTab] || tabsConfig.novedades;

  // ✅ mantener URL sincronizada (shareable + reload-safe)
  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set('tab', activeTab);
    next.set('area', area);
    next.set('q', searchQuery);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, area, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ───────────── HEADER ───────────── */}
      <header className="sticky top-0 z-40 h-17.5 border-b border-slate-200 bg-white/90 backdrop-blur shadow-[0_2px_8px_rgba(2,6,23,0.06)]">
        <div className="mx-auto flex h-full max-w-7xl items-center px-4 md:px-6">
          <div className="flex flex-1 items-center">
            <img
              src={LogoCeramica}
              alt="COBOCE"
              className="h-11 w-auto object-contain"
            />
          </div>

          {/* Nav centrada (desktop) */}
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 gap-8 md:flex"
            role="tablist"
            aria-label="Secciones de documentos"
          >
            {tabs.map((t) => {
              const selected = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(t.key)}
                  className={[
                    'text-sm font-semibold transition-colors',
                    selected
                      ? 'text-emerald-700'
                      : 'text-slate-900 hover:text-slate-700',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-1 justify-end">
            <button
              onClick={() => navigate('/login')}
              className="rounded-xl bg-emerald-800 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-900"
            >
              Sistema Intranet
            </button>
          </div>
        </div>
      </header>

      {/* ───────────── HERO ───────────── */}
      <section className="bg-linear-to-r from-emerald-800 via-emerald-800 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
          <div className="mb-4 md:mb-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Políticas, Procesos y Boletines
            </h1>
            <p className="mt-3 text-white/90">
              Busca por área, categoría o código de documento.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500/70" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, código, proceso..."
                className="w-full rounded-full bg-white px-12 py-3 text-sm text-slate-900 outline-none ring-1 ring-black/5 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <FunnelIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-700" />
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-11.5 min-w-45 appearance-none rounded-xl bg-white pl-12 pr-10 text-sm font-semibold text-slate-900 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Comercial">Comercial</option>
                  <option value="Producción">Producción</option>
                  <option value="Calidad">Calidad</option>
                  <option value="Seguridad">Seguridad</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  ▾
                </span>
              </div>

              <div className="flex rounded-xl bg-white p-1 shadow">
                {tabs.map((t) => {
                  const selected = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={[
                        'rounded-xl px-4 py-2 text-sm font-semibold transition',
                        selected
                          ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                          : 'text-slate-900 hover:bg-slate-100',
                      ].join(' ')}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 md:hidden">
            {tabs.map((t) => {
              const selected = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={[
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    selected
                      ? 'bg-white text-slate-900'
                      : 'bg-white/15 text-white hover:bg-white/20',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── CONTENIDO ───────────── */}
      <main className="mx-auto max-w-8xl px-4 pb-12 pt-6 md:px-6 md:pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            {current.title}
          </h2>
        </div>

        {/* ✅ un solo render */}
        <Novedades
          ObtenerDocumentos={(...args) => current.fetcher(...args)}
          searchQuery={debouncedQuery}
          area={area} // si tu componente lo necesita
          tab={activeTab} // opcional
        />
      </main>
    </div>
  );
}
