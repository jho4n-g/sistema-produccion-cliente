import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Select({
  label = 'Turno',
  value,
  onChange,
  placeholder = 'Selecciona un turno',
  getDatos,
  error = '', // ✅ string
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);
  const [valores, setValores] = useState([]); // ✅ array

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const resp = await getDatos();

        if (!alive) return;

        if (!resp?.ok) {
          toast.error(resp?.message || 'Error al cargar los turnos');
          setValores([]);
          return;
        }

        setValores(resp?.data ?? []);
      } catch (e) {
        if (alive) toast.error(e?.message || 'Error al cargar turnos');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [getDatos]);

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div
        className={[
          'relative rounded-2xl border bg-white shadow-sm transition',
          error
            ? 'border-red-400 ring-2 ring-red-100'
            : 'border-slate-200 focus-within:ring-2 focus-within:ring-slate-200',
          disabled || loading ? 'opacity-60' : '',
        ].join(' ')}
      >
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <select
          className="w-full appearance-none rounded-2xl bg-transparent px-10 py-3 text-sm text-slate-800 outline-none"
          value={value ?? ''}
          disabled={disabled || loading}
          onChange={(e) =>
            onChange?.(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="" disabled>
            {loading ? 'Cargando...' : placeholder}
          </option>

          {valores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          Selecciona el turno para registrar la planilla.
        </p>
      )}
    </div>
  );
}
