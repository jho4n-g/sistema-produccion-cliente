import { useState, useEffect, useMemo } from 'react';
import InputField from '../../../../components/InputField';
import { toast } from 'react-toastify';
import { periodoATexto } from '../../../../helpers/normalze.helpers';

// helpers
function sumarMesesYM(periodoYM, meses) {
  const [y, m] = String(periodoYM).split('-').map(Number);
  const base = new Date(y, m - 1, 1);
  base.setMonth(base.getMonth() + meses);
  const yy = base.getFullYear();
  const mm = String(base.getMonth() + 1).padStart(2, '0');
  return `${yy}-${mm}`;
}

function generarPeriodos12YM(periodoInicialYM) {
  const arr = [];
  for (let i = 0; i < 12; i++) arr.push(sumarMesesYM(periodoInicialYM, i));
  return arr;
}

function calcularGestion(periodo_inicio) {
  const [yStr, mStr] = String(periodo_inicio).split('-');
  const anio_inicio = Number(yStr);
  const mes = Number(mStr);

  if (
    !Number.isFinite(anio_inicio) ||
    !Number.isFinite(mes) ||
    mes < 1 ||
    mes > 12
  ) {
    return null;
  }

  // regla que ya estás usando:
  // si empieza en enero => gestión "2025"
  // si empieza desde febrero => "2025-2026"
  const anio_final = mes === 1 ? anio_inicio : anio_inicio + 1;
  const label = mes === 1 ? `${anio_inicio}` : `${anio_inicio}-${anio_final}`;

  const periodos12 = generarPeriodos12YM(periodo_inicio);
  const periodo_final = periodos12[11]; // 11 meses después

  return { anio_inicio, anio_final, label, periodo_final, periodos12 };
}

export default function GestionModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
  isEdit = false,
}) {
  const [form, setForm] = useState({ periodo_inicio: '' });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  // default: abril del año actual (como tú querías)
  const anioActual = new Date().getFullYear();
  const periodo_actual = `${anioActual}-04`;

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);

    // CREAR
    if (!isEdit) {
      setForm({ periodo_inicio: periodo_actual });
      setError({});
      setLoading(false);
      return () => {
        active = false;
      };
    }

    // EDITAR
    if (!id) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const data = await fetchById(id);
        if (!active) return;

        if (data?.ok) {
          // esperamos algo como {periodo_inicio:"2025-04"} o similar
          setForm({ periodo_inicio: data.dato?.periodo_inicio ?? '' });
        } else {
          toast.error(data?.message || 'No se pudo cargar el registro');
        }
      } catch (e) {
        if (active) toast.error(e?.message || 'Error del servidor');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, isEdit, id, fetchById, periodo_actual]);

  // Calculados (cada vez que cambia el periodo)
  const calc = useMemo(() => {
    if (!form?.periodo_inicio) return null;
    return calcularGestion(form.periodo_inicio);
  }, [form?.periodo_inicio]);

  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleValidation = () => {
    if (!form?.periodo_inicio) {
      setError({ periodo_inicio: 'Ingrese el periodo inicial' });
      toast.error('Datos incorrectos');
      return;
    }

    const c = calcularGestion(form.periodo_inicio);
    if (!c) {
      setError({ periodo_inicio: 'Periodo inválido' });
      toast.error('Periodo inválido');
      return;
    }

    // ✅ payload enriquecido (para tu backend)
    const payload = {
      periodo_inicio: form.periodo_inicio, // "YYYY-MM"
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 w-[92%] max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {loading && (
          <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <p className="text-sm font-semibold text-slate-800">
                Cargando datos…
              </p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Gestiones
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Entrada */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <InputField
                      label="Periodo de inicio"
                      type="month"
                      name="periodo_inicio"
                      value={form?.periodo_inicio || ''}
                      onChange={updateBase}
                      error={error.periodo_inicio}
                    />
                  </div>

                  {/* Resumen calculado */}
                  <div className="md:col-span-8">
                    {calc ? (
                      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
                            <b>Gestión:</b> {calc.label}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
                            <b>Año inicio:</b> {calc.anio_inicio}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
                            <b>Año final:</b> {calc.anio_final}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
                            <b>Periodo final:</b>{' '}
                            {periodoATexto(calc.periodo_final)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">
                        Selecciona un periodo para ver el rango.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview 12 periodos */}
              {calc && (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      12 periodos generados
                    </h4>
                    <span className="text-sm text-slate-600">
                      {periodoATexto(calc.periodos12[0])} →{' '}
                      {periodoATexto(calc.periodos12[11])}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {calc.periodos12.map((p, i) => (
                      <span
                        key={p}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${
                          i === 0
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title={periodoATexto(p)}
                      >
                        {periodoATexto(p)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  className="rounded-xl bg-red-800 px-4 py-2 text-white hover:bg-red-900"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  className="rounded-xl bg-green-800 px-4 py-2 text-white hover:bg-green-900"
                  onClick={handleValidation}
                >
                  {isEdit ? 'Guardar cambios' : 'Crear gestión'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
