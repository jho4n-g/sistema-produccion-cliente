import { useState, useEffect } from 'react';
import { DatosSerigrafia } from '../../../../../schema/Produccion/Seccion/Serigrafia.schema';
import { extractArrayFieldErrors } from '../../../../../helpers/normalze.helpers';
import InputField from '../../../../../components/InputField';
import { toast } from 'react-toastify';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const rows = 8;

const NuevaFilaTabla = () => ({
  hora: '',
  operador_apl_pasta1: '',
  sp_apl_pasta1: '',
  operador_v_pasta1: '',
  sp_v_pasta1: '',
  operador_d_pasta1: '',
  sp_d_pasta1: '',
  operador_apl_pasta2: '',
  sp_apl_pasta2: '',
  operador_v_pasta2: '',
  sp_v_pasta2: '',
  operador_d_pasta2: '',
  sp_d_pasta2: '',
  operador_apl_pasta3: '',
  sp_apl_pasta3: '',
  operador_v_pasta3: '',
  sp_v_pasta3: '',
  operador_d_pasta3: '',
  sp_d_pasta3: '',
  operador_apl_pasta4: '',
  sp_apl_pasta4: '',
  operador_v_pasta4: '',
  sp_v_pasta4: '',
  operador_d_pasta4: '',
  sp_d_pasta4: '',
});

export default function SerigrafiaModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
}) {
  const [form, setForm] = useState();
  const [error, setError] = useState({});
  const [tablaError, setTablaError] = useState({});
  const [loading, setLoading] = useState(false);
  const [obsInput, setObsInput] = useState('');
  useEffect(() => {
    if (!open || !id) return; // evita correr si no aplica

    let active = true; // evita setState tras unmount
    setLoading(true);

    (async () => {
      try {
        const data = await fetchById(id); // ← ahora sí esperamos aquí
        console.log(data);
        if (!active) return;
        // console.log('atimizado', data);
        if (data?.ok) setForm(data.dato ?? {});
        else toast.error(data?.message || 'No se pudo cargar el registro');
      } catch (e) {
        if (active) toast.error(e?.message || 'Error del servidor');
      } finally {
        if (active) setLoading(false); // ← se apaga al terminar de verdadfi
      }
    })();

    return () => {
      active = false;
    };
  }, [open, id, fetchById]);

  if (!open) return null;

  const addObs = () => {
    const v = obsInput.trim();
    console.log('valor ', v);
    if (!v) return;
    setForm((f) => ({
      ...f,
      observacionesSer: [...(f.observacionesSer ?? []), { observacion: v }],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    setForm((f) => ({
      ...f,
      observacionesSer: f.observacionesSer.filter((_, i) => i !== index),
    }));
  };
  const setCargaTabla = (idx, field, value) => {
    setForm((f) => {
      const rows = Array.isArray(f?.datos_tabla_serigrafiado)
        ? [...f.datos_tabla_serigrafiado]
        : [];
      if (idx < 0 || idx >= rows.length) return f; // evita índices fuera de rango
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, datos_tabla_serigrafiado: rows };
    });

    // Usa el setter real de errores (p.ej., setTablaError)
    setTablaError?.((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = rowErr;

      // Opcional: limpia la fila si ya no tiene errores
      if (Object.keys(rowErr).length === 0) arr[idx] = undefined;

      return arr;
    });
  };
  const addRows = () => {
    setForm((f) => {
      if (f.datos_tabla_serigrafiado.length >= rows) return f;
      return {
        ...f,
        datos_tabla_serigrafiado: [
          ...f.datos_tabla_serigrafiado,
          NuevaFilaTabla(),
        ],
      };
    });
  };

  const removeRows = () => {
    setForm((f) => {
      if (f.datos_tabla_serigrafiado.length <= 0) return f;
      return {
        ...f,
        datos_tabla_serigrafiado: f.datos_tabla_serigrafiado.slice(0, -1),
      };
    });
  };

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };
  const handleValidation = async () => {
    const result = DatosSerigrafia.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'datos_tabla_esmalte'
      );
      setTablaError(tablaErrors);
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    } else {
      const data = result.data;
      handleSave(data);
    }
  };
  const handleSave = (payload) => {
    onSave(payload);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay (fondo) */}
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className="relative z-10 w-[92%] max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
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
                Esmalte Modal
              </h3>
            </div>
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Fila 1 */}
                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Fecha"
                    type="date"
                    name="fecha"
                    value={form?.fecha || ''}
                    onChange={updateBase}
                    error={error.fecha}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-3">
                  <InputField
                    label="Turno"
                    type="text"
                    name="turno"
                    value={form?.turno || ''}
                    onChange={updateBase}
                    error={error.turno}
                  />
                </div>

                {/* Fila 2 */}
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Operador"
                    type="text"
                    name="operador"
                    value={form?.operador || ''}
                    onChange={updateBase}
                    error={error.operador}
                  />
                </div>

                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Supervisor de turno"
                    type="text"
                    name="supervisor_turno"
                    value={form?.supervisor_turno || ''}
                    onChange={updateBase}
                    error={error.supervisor_turno}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Linea"
                    type="text"
                    name="linea"
                    value={form?.linea || ''}
                    onChange={updateBase}
                    error={error.linea}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Producto"
                    type="text"
                    name="producto"
                    value={form?.producto || ''}
                    onChange={updateBase}
                    error={error.producto}
                  />
                </div>

                {/* Observaciones + botón */}
                <div className="md:col-span-2 lg:col-span-7">
                  <InputField
                    label="Observaciones"
                    type="text"
                    name="observaciones"
                    value={obsInput || ''}
                    onChange={(e) => setObsInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addObs();
                      }
                    }}
                  />

                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form?.observacionesSer ?? []).map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
                      >
                        <span className="max-w-55 sm:max-w-[320px] truncate">
                          {item.observacion}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeObs(idx)}
                          className="rounded-full p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                          aria-label="Eliminar observación"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-1 flex md:justify-end lg:items-start lg:pt-6">
                  <button
                    type="button"
                    className="w-full md:w-auto rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900 inline-flex justify-center"
                    onClick={addObs}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end py-5 px-10 gap-5 ">
              <button
                className="  rounded-xl bg-white px-3 py-2 text-reen-900 ring-1 ring-red-700 hover:bg-red-100"
                onClick={removeRows}
              >
                Eliminar fila
              </button>
              <button
                className="  rounded-xl bg-white px-3 py-2 text-reen-900 ring-1 ring-green-900 hover:bg-emerald-100"
                onClick={addRows}
              >
                Agregar fila
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5">
              <table className="w-full min-w-max text-sm">
                <thead
                  className="bg-slate-50 text-slate-600 
                uppercase text-xs tracking-wide"
                >
                  <tr className="border border-slate-300">
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      rowSpan={3}
                    >
                      HORA
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={6}
                    >
                      <InputField
                        label="Pasta 1"
                        type="text"
                        name="pasta1"
                        value={form?.pasta1 || ''}
                        onChange={updateBase}
                        error={error.pasta1}
                      />
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={6}
                    >
                      <InputField
                        label="Pasta 2"
                        type="text"
                        name="pasta2"
                        value={form?.pasta2 || ''}
                        onChange={updateBase}
                        error={error.pasta2}
                      />
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={6}
                    >
                      <InputField
                        label="Pasta 3"
                        type="text"
                        name="pasta3"
                        value={form?.pasta3 || ''}
                        onChange={updateBase}
                        error={error.pasta3}
                      />
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={6}
                    >
                      <InputField
                        label="Pasta 4"
                        type="text"
                        name="pasta4"
                        value={form?.pasta4 || ''}
                        onChange={updateBase}
                        error={error.pasta4}
                      />
                    </th>
                  </tr>
                  <tr className="border border-slate-300">
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      APL [G]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      V [s]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      D [g/cm³]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      APL [G]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      V [s]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      D [g/cm³]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      APL [G]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      V [s]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      D [g/cm³]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      APL [G]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      V [s]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      D [g/cm³]
                    </th>
                  </tr>
                  <tr className="border border-slate-300">
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      S.P.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {form?.datos_tabla_serigrafiado?.map((row, idx) => (
                    <tr key={idx} className="border border-slate-300 p-3">
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="time"
                          name="hora"
                          value={row.hora}
                          onChange={(e) => {
                            setCargaTabla(idx, 'hora', e.target.value);
                          }}
                          error={!!tablaError[idx]?.hora}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_apl_pasta1"
                          value={row.operador_apl_pasta1}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_apl_pasta1',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_apl_pasta1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_apl_pasta1"
                          value={row.sp_apl_pasta1}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_apl_pasta1', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_apl_pasta1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_v_pasta1"
                          value={row.operador_v_pasta1}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_v_pasta1',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_v_pasta1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_v_pasta1"
                          value={row.sp_v_pasta1}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_v_pasta1', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_v_pasta1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_d_pasta1"
                          value={row.operador_d_pasta1}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_d_pasta1',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_d_pasta1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_d_pasta1"
                          value={row.sp_d_pasta1}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_d_pasta1', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_d_pasta1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_apl_pasta2"
                          value={row.operador_apl_pasta2}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_apl_pasta2',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_apl_pasta2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_apl_pasta2"
                          value={row.sp_apl_pasta2}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_apl_pasta2', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_apl_pasta2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_v_pasta2"
                          value={row.operador_v_pasta2}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_v_pasta2',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_v_pasta2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_v_pasta2"
                          value={row.sp_v_pasta2}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_v_pasta2', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_v_pasta2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_d_pasta2"
                          value={row.operador_d_pasta2}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_d_pasta2',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_d_pasta2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_d_pasta2"
                          value={row.sp_d_pasta2}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_d_pasta2', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_d_pasta2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_apl_pasta3"
                          value={row.operador_apl_pasta3}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_apl_pasta3',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_apl_pasta3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_apl_pasta3"
                          value={row.sp_apl_pasta3}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_apl_pasta3', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_apl_pasta3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_v_pasta3"
                          value={row.operador_v_pasta3}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_v_pasta3',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_v_pasta3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_v_pasta3"
                          value={row.sp_v_pasta3}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_v_pasta3', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_v_pasta3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_d_pasta3"
                          value={row.operador_d_pasta3}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_d_pasta3',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_d_pasta3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_d_pasta3"
                          value={row.sp_d_pasta3}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_d_pasta3', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_d_pasta3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_apl_pasta4"
                          value={row.operador_apl_pasta4}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_apl_pasta4',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_apl_pasta4}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_apl_pasta4"
                          value={row.sp_apl_pasta4}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_apl_pasta4', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_apl_pasta4}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_v_pasta4"
                          value={row.operador_v_pasta4}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_v_pasta4',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_v_pasta4}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_v_pasta4"
                          value={row.sp_v_pasta4}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_v_pasta4', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_v_pasta4}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_d_pasta4"
                          value={row.operador_d_pasta4}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_d_pasta4',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_d_pasta4}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sp_d_pasta4"
                          value={row.sp_d_pasta4}
                          onChange={(e) => {
                            setCargaTabla(idx, 'sp_d_pasta4', e.target.value);
                          }}
                          error={!!tablaError[idx]?.sp_d_pasta4}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-5 gap-5">
              <button
                className="rounded-xl bg-red-600 px-3 py-2 text-white hover:bg-red-900"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                onClick={handleValidation}
              >
                Guardar cambios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
