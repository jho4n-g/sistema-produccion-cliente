import React, { useEffect, useId, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export default function Select({
  label = 'Turno',
  value,
  onChange,
  placeholder = 'Selecciona un turno',
  getDatos,
  error = '',
  disabled = false,
  hint = 'Selecciona para registrar la planilla.',
  required = false,
  icon, // opcional: ReactNode
}) {
  const [loading, setLoading] = useState(false);
  const [valores, setValores] = useState([]);
  const selectId = useId();

  const describedBy = useMemo(() => {
    if (error) return `${selectId}-error`;
    return `${selectId}-hint`;
  }, [error, selectId]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const resp = await getDatos?.();

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

  const hasValue = value !== null && value !== undefined && value !== '';

  const frameClass = [
    'relative rounded-2xl border bg-white shadow-sm transition',
    'focus-within:ring-4',
    error
      ? 'border-red-400 focus-within:ring-red-100'
      : hasValue
        ? 'border-emerald-300 focus-within:ring-emerald-100'
        : 'border-slate-200 focus-within:ring-slate-200',
    disabled || loading ? 'opacity-60' : 'hover:border-slate-300',
  ].join(' ');

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-slate-700"
        >
          {label}
        </label>

        <span
          className={[
            'text-[11px] font-semibold',
            required ? 'text-slate-600' : 'text-slate-400',
          ].join(' ')}
        >
          {required ? 'Requerido' : 'Opcional'}
        </span>
      </div>

      <div className={frameClass}>
        {/* Icono izquierdo (opcional) */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon ?? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          )}
        </div>

        <select
          id={selectId}
          className={[
            'w-full appearance-none rounded-2xl bg-transparent',
            'px-10 py-3 text-sm text-slate-800 outline-none',
            'disabled:cursor-not-allowed',
          ].join(' ')}
          value={value ?? ''}
          disabled={disabled || loading}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onChange={(e) =>
            onChange?.(e.target.value ? Number(e.target.value) : null)
          }
        >
          {/* Placeholder seleccionable para permitir volver a null */}
          <option value="">{loading ? 'Cargando...' : placeholder}</option>

          {valores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>

        {/* Derecha: spinner o caret */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={error ? 'text-red-500' : 'text-slate-400'}
              />
            </svg>
          )}
        </div>
      </div>

      {error ? (
        <p
          id={`${selectId}-error`}
          className="mt-2 flex items-center gap-2 text-xs font-semibold text-red-600"
        >
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-100">
            !
          </span>
          {error}
        </p>
      ) : (
        <p id={`${selectId}-hint`} className="mt-2 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}
