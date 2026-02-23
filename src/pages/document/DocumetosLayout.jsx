import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import LogoCeramica from '../../img/logo-ceramica-coboce.png';

import Novedades from './TiposDocumentos/Novedades';
import {
  getDocumentos,
  getDocumentosProcedimientoPolitica,
} from '../../service/Documentos/General';
import { getDocumentsNovedades } from '../../service/Documentos/Novedades';

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

  const [activeTab, setActiveTab] = useState(params.get('tab') || 'novedades');
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '');
  const [area, setArea] = useState(params.get('area') || 'Todas');
  const [sortBy, setSortBy] = useState(params.get('sort') || 'recientes');
  const [resultCount, setResultCount] = useState(0);
  const [isListLoading, setIsListLoading] = useState(false);

  const debouncedQuery = useDebouncedValue(searchQuery, 350);

  const tabsConfig = useMemo(
    () => ({
      novedades: {
        label: 'Novedades',
        title: 'Novedades',
        fetcher: getDocumentos,
      },
      politicas: {
        label: 'Gestion de calidad',
        title: 'Gestion de calidad',
        fetcher: getDocumentosProcedimientoPolitica,
      },

      boletines: {
        label: 'Boletines',
        title: 'Boletines',
        fetcher: getDocumentsNovedades,
      },
    }),
    [],
  );

  const tabs = useMemo(
    () =>
      Object.entries(tabsConfig).map(([key, v]) => ({ key, label: v.label })),
    [tabsConfig],
  );

  const current = tabsConfig[activeTab] || tabsConfig.novedades;
  const hasFilters =
    searchQuery.trim() || area !== 'Todas' || sortBy !== 'recientes';

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set('tab', activeTab);
    next.set('area', area);
    next.set('q', searchQuery);
    next.set('sort', sortBy);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, area, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setArea('Todas');
    setSortBy('recientes');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 h-20 border-b border-slate-200 bg-white/90 backdrop-blur shadow-[0_2px_8px_rgba(2,6,23,0.06)]">
        <div className="mx-auto flex h-full max-w-7xl items-center px-4 md:px-6">
          <div className="flex flex-1 items-center">
            <img
              src={LogoCeramica}
              alt="COBOCE"
              className="h-11 w-auto object-contain"
            />
          </div>

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

      <section className="bg-linear-to-r from-emerald-800 via-emerald-800 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
          <div className="mb-5 md:mb-7">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Ceramica Coboce
            </h1>
            <p className="mt-3 text-white/90">
              Encuentra políticas, procedimientos, boletines y novedades en un
              solo lugar.
            </p>
          </div>

          <div
            className="mb-4 flex gap-2 overflow-x-auto pb-1"
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
                    'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
                    selected
                      ? 'bg-white text-slate-900'
                      : 'bg-white/15 text-white hover:bg-white/25',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center lg:gap-4">
            <div className="relative min-w-0">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500/70" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, código, proceso..."
                className="w-full rounded-full bg-white px-12 py-3 text-sm text-slate-900 outline-none ring-1 ring-black/5 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="relative">
              <FunnelIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-700" />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="h-11.5 w-full appearance-none rounded-xl bg-white pl-12 pr-10 text-sm font-semibold text-slate-900 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-emerald-700 lg:w-48"
              >
                <option value="Todas">Todas las áreas</option>
                <option value="Comercial">Comercial</option>
                <option value="Producción">Producción</option>
                <option value="Calidad">Calidad</option>
                <option value="Seguridad">Seguridad</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                ▾
              </span>
            </div>

            <div className="relative">
              <ArrowsUpDownIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-700" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11.5 w-full appearance-none rounded-xl bg-white pl-12 pr-10 text-sm font-semibold text-slate-900 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-emerald-700 lg:w-52"
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
                <option value="titulo">Título A-Z</option>
                <option value="codigo">Código A-Z</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                ▾
              </span>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className={[
                'inline-flex h-11.5 items-center justify-center rounded-xl px-4 text-sm font-semibold transition',
                hasFilters
                  ? 'bg-white text-slate-900 hover:bg-slate-100'
                  : 'cursor-not-allowed bg-white/50 text-slate-300',
              ].join(' ')}
            >
              Limpiar filtros
            </button>
          </div>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                >
                  Texto: {searchQuery}
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}

              {area !== 'Todas' && (
                <button
                  type="button"
                  onClick={() => setArea('Todas')}
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                >
                  Área: {area}
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}

              {sortBy !== 'recientes' && (
                <button
                  type="button"
                  onClick={() => setSortBy('recientes')}
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                >
                  Orden: {sortBy}
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-8xl px-4 pb-12 pt-6 md:px-6 md:pb-16">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {current.title}
            </h2>
            <p className="text-sm text-slate-500">
              {isListLoading
                ? 'Cargando documentos...'
                : `${resultCount} documento${resultCount === 1 ? '' : 's'} disponibles`}
            </p>
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Intranet documental
          </p>
        </div>

        <Novedades
          ObtenerDocumentos={current.fetcher}
          searchQuery={debouncedQuery}
          area={area}
          sortBy={sortBy}
          onFilteredCountChange={setResultCount}
          onLoadingChange={setIsListLoading}
        />
      </main>
    </div>
  );
}
