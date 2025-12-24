import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import InputField from '../../../../components/InputField';
import { toast } from 'react-toastify';
import { extractArrayFieldErrors } from '../../../../helpers/normalze.helpers';
import ConfirmModal from '../../../../components/ConfirmModal';
import { registerObj } from '../../../../service/Produccion/Secciones/Atomizado.services';
import { DatosAtomizado } from '../../../../schema/Produccion/Seccion/Atomizado.schema';
//
import { getObjs } from '../../../../service/Produccion/Turno.services';
import Select from '../../../../components/Select';

const filasControlGranulomtria = [
  { key: 'hora', label: 'HORA', type: 'time' },
  { key: 'silo_n', label: 'SILO N°', type: 'number' },
  { key: 'humedad', label: '% HUMEDAD', type: 'number' },
  { key: 'malla_35', label: 'MALLA 35', type: 'number' },
  { key: 'malla_40', label: 'MALLA 40', type: 'number' },
  { key: 'malla_50', label: 'MALLA 50', type: 'number' },
  { key: 'malla_70', label: 'MALLA 70', type: 'number' },
  { key: 'malla_100', label: 'MALLA 100', type: 'number' },
  { key: 'malla_120', label: 'MALLA 120', type: 'number' },
  { key: 'fondo', label: 'FONDO', type: 'number' },
];

const makeGranulometriaCol = () => ({
  hora: '',
  silo_n: '',
  humedad: '',
  malla_35: '',
  malla_40: '',
  malla_50: '',
  malla_70: '',
  malla_100: '',
  malla_120: '',
  fondo: '',
});
const makeFosaRow = (label) => ({
  label,
  densidad: '',
  viscosidad: '',
  residuos: '',
});

const NuevaFilaTabla = () => ({
  hora: '',
  pba1_bareas: '',
  pa1_bareas: '',
  pba2_bareas: '',
  pa2_bareas: '',
  pba3_bareas: '',
  pa3_bareas: '',
  te_c1: '',
  te_c2: '',
  ts_c: '',
  as: '',
  lanz_n: '',
  humedad_uno: '',
  humedad_dos: '',
  humedad_tres: '',
  silo_descarga: '',
  producto: '',
  n_silo_llenos: '',
});

const initialForm = () => ({
  fecha: '',
  hora_inicio: '',
  hora_final: '',
  operador: '',
  supervisor_turno: '',
  observacionesAtomizadoDatos: [],
  tabla_atomizado: [],
  control_granulometria: [
    makeGranulometriaCol(),
    makeGranulometriaCol(),
    makeGranulometriaCol(),
    makeGranulometriaCol(),
  ],
  control_fosas: [makeFosaRow('1'), makeFosaRow('2'), makeFosaRow('SERVICIO')],
});

const rows = 8;

export default function Atomizado() {
  const [form, setForm] = useState(initialForm());
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSave, setDataSave] = useState(null);
  const [error, setError] = useState({});
  const [tablaError, setTablaError] = useState({});
  const [errorGranulometria, setErrorGranulometria] = useState({});
  const [errorTablaFosa, setErrorTablaFosa] = useState({});
  const [obsInput, setObsInput] = useState('');

  const [turnoError, setTurnoError] = useState(null);
  const [turnoId, setTurnoId] = useState(null);

  const addObs = () => {
    const v = obsInput.trim();
    if (!v) return;
    setForm((f) => ({
      ...f,
      observacionesAtomizadoDatos: [
        ...(f.observacionesAtomizadoDatos ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    setForm((f) => ({
      ...f,
      observacionesAtomizadoDatos: f.observacionesAtomizadoDatos.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const setCargaTabla = (idx, field, value) => {
    setForm((f) => {
      const rows = Array.isArray(f?.tabla_atomizado)
        ? [...f.tabla_atomizado]
        : [];
      if (idx < 0 || idx >= rows.length) return f; // evita índices fuera de rango
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, tabla_atomizado: rows };
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
  const setGran = (colIdx, field, value) => {
    setForm((f) => {
      const next = [...f.control_granulometria];
      next[colIdx] = { ...next[colIdx], [field]: value };
      return { ...f, control_granulometria: next };
    });
    setErrorGranulometria((prev) => {
      if (!prev?.[colIdx]?.[field]) return prev; // no había error

      const next = [...prev];
      const colErrors = { ...(next[colIdx] ?? {}) };

      delete colErrors[field];

      if (Object.keys(colErrors).length === 0) {
        next[colIdx] = {};
      } else {
        next[colIdx] = colErrors;
      }
      return next;
    });
  };

  const setFosa = (idx, field, value) => {
    setForm((f) => {
      const next = [...f.control_fosas];
      next[idx] = { ...next[idx], [field]: value };
      return { ...f, control_fosas: next };
    });

    setErrorTablaFosa?.((prev) => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const rowErr = { ...(arr[idx] ?? {}) };
      delete rowErr[field];
      arr[idx] = rowErr;

      // Opcional: limpia la fila si ya no tiene errores
      if (Object.keys(rowErr).length === 0) arr[idx] = undefined;

      return arr;
    });
  };

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };
  const handleValidation = async () => {
    if (!turnoId) {
      setTurnoError('Selecciona un turno');
    } else {
      setTurnoError('');
    }

    const result = DatosAtomizado.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'tabla_atomizado'
      );
      const tablaErrorsControlGranulometria = extractArrayFieldErrors(
        result.error,
        'control_granulometria'
      );
      const tablaErrorFosa = extractArrayFieldErrors(
        result.error,
        'control_fosas'
      );
      setErrorTablaFosa(tablaErrorFosa);
      setErrorGranulometria(tablaErrorsControlGranulometria);
      setTablaError(tablaErrors);
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    } else {
      const data = { turno_id: turnoId, ...result.data };
      setDataSave(data);
      setOpenModalConfirm(true);
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await registerObj(dataSave);
      if (res.ok) {
        toast.success(res.message || 'Se guardo exitosamente');
        setOpenModalConfirm(false);
        setForm(initialForm());
      }
      if (!res.ok) {
        toast.error(res.message || 'No se puedo guardar los datos');
        setOpenModalConfirm(false);
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const addRows = () => {
    setForm((f) => {
      if (f.tabla_atomizado.length >= rows) return f;
      return {
        ...f,
        tabla_atomizado: [...f.tabla_atomizado, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    setForm((f) => {
      if (f.tabla_atomizado.length <= 0) return f;
      return { ...f, tabla_atomizado: f.tabla_atomizado.slice(0, -1) };
    });
  };
  return (
    <>
      <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Atomizado Modal
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
              value={form.fecha || ''}
              onChange={updateBase}
              error={error.fecha}
            />
          </div>

          <div className="md:col-span-1 lg:col-span-3">
            <InputField
              label="Hora inicio"
              type="time"
              name="hora_inicio"
              value={form.hora_inicio || ''}
              onChange={updateBase}
              error={error.hora_inicio}
            />
          </div>

          <div className="md:col-span-1 lg:col-span-3">
            <InputField
              label="Hora final"
              type="time"
              name="hora_final"
              value={form.hora_final || ''}
              onChange={updateBase}
              error={error.hora_final}
            />
          </div>

          <div className="md:col-span-1 lg:col-span-3">
            <Select
              label="Turno"
              value={turnoId}
              onChange={(v) => {
                setTurnoId(v);
                setTurnoError('');
              }}
              placeholder="Selecciona un turno"
              getDatos={getObjs}
              error={turnoError}
            />
          </div>

          {/* Fila 2 */}
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Operador"
              type="text"
              name="operador"
              value={form.operador || ''}
              onChange={updateBase}
              error={error.operador}
            />
          </div>

          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Supervisor de turno"
              type="text"
              name="supervisor_turno"
              value={form.supervisor_turno || ''}
              onChange={updateBase}
              error={error.supervisor_turno}
            />
          </div>

          {/* Observaciones + botón */}
          <div className="md:col-span-2 lg:col-span-6">
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
              {(form.observacionesAtomizadoDatos ?? []).map((item, idx) => (
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
          <div className="md:col-span-2 lg:col-span-3 mt-6">
            <button
              className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
              onClick={handleValidation}
            >
              Guardar cambios
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
        <table className="min-w-750 text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
            <tr className="border border-slate-300">
              <th className="text-center border-r border-slate-300" rowSpan={2}>
                HORA
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                PB1
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                PA1
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                PB2
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                PA2
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                PB3
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                PA3
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                colSpan={2}
              >
                TE
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                TS
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                AS
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                LANZ
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                colSpan={3}
                rowSpan={2}
              >
                HUMEDAD
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                SILO
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                PRODUCTO
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                N° SILOS LLENOS
              </th>
            </tr>
            <tr className="border border-slate-300">
              <th className="px-10 py-3 text-center border-r border-slate-300">
                Bareas
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                Bareas
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                Bareas
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                Bareas
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                Bareas
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                Bareas
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                colSpan={2}
              >
                °C
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                °C
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                °C
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                DESCARGANDO
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {form.tabla_atomizado?.map((row, idx) => (
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
                    name="pa1_bareas"
                    value={row.pba1_bareas}
                    onChange={(e) => {
                      setCargaTabla(idx, 'pba1_bareas', e.target.value);
                    }}
                    error={!!tablaError[idx]?.pba1_bareas}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="pa1_bareas"
                    value={row.pa1_bareas}
                    onChange={(e) => {
                      setCargaTabla(idx, 'pa1_bareas', e.target.value);
                    }}
                    error={!!tablaError[idx]?.pa1_bareas}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="pa2_bareas"
                    value={row.pba2_bareas}
                    onChange={(e) => {
                      setCargaTabla(idx, 'pba2_bareas', e.target.value);
                    }}
                    error={!!tablaError[idx]?.pba2_bareas}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="pa2_bareas"
                    value={row.pa2_bareas}
                    onChange={(e) => {
                      setCargaTabla(idx, 'pa2_bareas', e.target.value);
                    }}
                    error={!!tablaError[idx]?.pa2_bareas}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="pa3_bareas"
                    value={row.pba3_bareas}
                    onChange={(e) => {
                      setCargaTabla(idx, 'pba3_bareas', e.target.value);
                    }}
                    error={!!tablaError[idx]?.pba3_bareas}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="pa3_bareas"
                    value={row.pa3_bareas}
                    onChange={(e) => {
                      setCargaTabla(idx, 'pa3_bareas', e.target.value);
                    }}
                    error={!!tablaError[idx]?.pa3_bareas}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="te_c1"
                    value={row.te_c1}
                    onChange={(e) => {
                      setCargaTabla(idx, 'te_c1', e.target.value);
                    }}
                    error={!!tablaError[idx]?.te_c1}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="te_c2"
                    value={row.te_c2}
                    onChange={(e) => {
                      setCargaTabla(idx, 'te_c2', e.target.value);
                    }}
                    error={!!tablaError[idx]?.te_c2}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="ts_c"
                    value={row.ts_c}
                    onChange={(e) => {
                      setCargaTabla(idx, 'ts_c', e.target.value);
                    }}
                    error={!!tablaError[idx]?.ts_c}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="as"
                    value={row.as}
                    onChange={(e) => {
                      setCargaTabla(idx, 'as', e.target.value);
                    }}
                    error={!!tablaError[idx]?.as}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="as"
                    value={row.as}
                    onChange={(e) => {
                      setCargaTabla(idx, 'as', e.target.value);
                    }}
                    error={!!tablaError[idx]?.as}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="humedad_uno"
                    value={row.humedad_uno}
                    onChange={(e) => {
                      setCargaTabla(idx, 'humedad_uno', e.target.value);
                    }}
                    error={!!tablaError[idx]?.humedad_uno}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="humedad_dos"
                    value={row.humedad_dos}
                    onChange={(e) => {
                      setCargaTabla(idx, 'humedad_dos', e.target.value);
                    }}
                    error={!!tablaError[idx]?.humedad_dos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="humedad_tres"
                    value={row.humedad_tres}
                    onChange={(e) => {
                      setCargaTabla(idx, 'humedad_tres', e.target.value);
                    }}
                    error={!!tablaError[idx]?.humedad_tres}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="silo_descarga"
                    value={row.silo_descarga}
                    onChange={(e) => {
                      setCargaTabla(idx, 'silo_descarga', e.target.value);
                    }}
                    error={!!tablaError[idx]?.silo_descarga}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="text"
                    name="producto"
                    value={row.producto}
                    onChange={(e) => {
                      setCargaTabla(idx, 'producto', e.target.value);
                    }}
                    error={!!tablaError[idx]?.producto}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="text"
                    name="n_silo_llenos"
                    value={row.n_silo_llenos}
                    onChange={(e) => {
                      setCargaTabla(idx, 'n_silo_llenos', e.target.value);
                    }}
                    error={!!tablaError[idx]?.n_silo_llenos}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 flex justify-center">
        <table className="text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
            <tr className="border-b border-slate-300">
              <th
                className="px-10 py-3 text-center border border-slate-300"
                colSpan={5}
              >
                CONTROL GRANULOMETIRA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filasControlGranulomtria.map((r) => (
              <tr key={r.key} className="border border-slate-300 p-3">
                <td className="p-2 border-r border-slate-300 text-center align-middle ">
                  {r.label}
                </td>
                {form.control_granulometria?.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className="p-2 border-r border-slate-300 text-center align-middle "
                  >
                    <InputField
                      type={r.type ?? 'text'}
                      value={col[r.key] ?? ''}
                      onChange={(e) => setGran(colIdx, r.key, e.target.value)}
                      errorMode="border"
                      error={errorGranulometria?.[colIdx]?.[r.key]}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5 flex justify-center">
        <table className="text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
            <tr className="border-b border-slate-300">
              <th
                className="px-10 py-3 text-center border border-slate-300"
                colSpan={4}
              >
                CONTROL FOSAS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {form?.control_fosas.map((row, idx) => (
              <tr key={idx} className="border border-slate-300">
                <td className="p-2 border-r border-slate-300 text-center align-middle ">
                  {row.label}
                </td>
                <td className="p-2 border-r border-slate-300 text-center align-middle ">
                  <InputField
                    type="number"
                    value={row.densidad}
                    onChange={(e) => setFosa(idx, 'densidad', e.target.value)}
                    errorMode="border"
                    error={!!errorTablaFosa[idx]?.densidad}
                  />
                </td>
                <td className="p-2 border-r border-slate-300 text-center align-middle ">
                  <InputField
                    type="number"
                    value={row.viscosidad}
                    onChange={(e) => setFosa(idx, 'viscosidad', e.target.value)}
                    errorMode="border"
                    error={!!errorTablaFosa[idx]?.viscosidad}
                  />
                </td>
                <td className="p-2 border-r border-slate-300 text-center align-middle ">
                  <InputField
                    type="number"
                    value={row.residuo}
                    onChange={(e) => setFosa(idx, 'residuo', e.target.value)}
                    errorMode="border"
                    error={!!errorTablaFosa[idx]?.residuo}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={openModalConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenModalConfirm(false)}
        onConfirm={handleSave}
      />
    </>
  );
}
