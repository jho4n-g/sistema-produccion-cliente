import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { datosBarbotina } from '@schema/Produccion/Seccion/Barbotina.schema';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';
import ConfirmModal from '@components/ConfirmModal';
import { registerObj } from '@service/Produccion/Secciones/Barbotina.services';
//
import { getObjs } from '@service/Produccion/Turno.services';
import Select from '@components/Select';

const rows = 15;

const NuevaFilaTabla = () => ({
  deflo_cargando_molinos: '',
  dens_descargando_molinos: '',
  h2o_cargando_molinos: '',
  hora_final: '',
  hora_inicio: '',
  n_fosa_descargando_molinos: '',
  n_molino_cargando_molinos: '',
  producto_descargando_molinos: '',
  reoma_cargando_molinos: '',
  res_descargando_molinos: '',
  tn_lugar_cuantro_cargando_molinos: '',
  tn_lugar_dos_cargando_molinos: '',
  tn_lugar_tres_cargando_molinos: '',
  tn_lugar_uno_cargando_molinos: '',
  visc_descargando_molinos: '',
});
const initialForm = () => ({
  deflo_proveerdo_cargando_molinos: '',
  equipo: '',
  fecha: '',
  horometro_final: '',
  horometro_inicio: '',
  humedad_lugar_cuarto_cargando_molinos: '',
  humedad_lugar_dos_cargando_molinos: '',
  humedad_lugar_tres_cargando_molinos: '',
  humedad_lugar_uno_cargando_molinos: '',
  nombre_lugar_cuarto_cargando_molinos: '',
  nombre_lugar_dos_cargando_molinos: '',
  nombre_lugar_tres_cargando_molinos: '',
  nombre_lugar_uno_cargando_molinos: '',
  operador: '',
  supervisor_turno: '',
  turno: '',
  ObservacionesBarbotinaDatos: [],
  TablaBarbotinaDatos: [],
});

export default function Barbotina() {
  const [form, setForm] = useState(initialForm());
  const [error, setError] = useState({});
  const [tablaError, setTablaError] = useState({});
  const [loading, setLoading] = useState(false);
  const [obsInput, setObsInput] = useState('');
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [dataSave, setDataSave] = useState(null);

  const [turnoError, setTurnoError] = useState(null);
  const [turnoId, setTurnoId] = useState(null);

  const addObs = () => {
    const v = obsInput.trim();
    if (!v) return;
    setForm((f) => ({
      ...f,
      ObservacionesBarbotinaDatos: [
        ...(f.ObservacionesBarbotinaDatos ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    setForm((f) => ({
      ...f,
      ObservacionesBarbotinaDatos: f.ObservacionesBarbotinaDatos.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const setCargaTabla = (idx, field, value) => {
    setForm((f) => {
      const rows = Array.isArray(f?.TablaBarbotinaDatos)
        ? [...f.TablaBarbotinaDatos]
        : [];
      if (idx < 0 || idx >= rows.length) return f; // evita índices fuera de rango
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, TablaBarbotinaDatos: rows };
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
  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };
  const addRows = () => {
    setForm((f) => {
      if (f.TablaBarbotinaDatos.length >= rows) return f;
      return {
        ...f,
        TablaBarbotinaDatos: [...f.TablaBarbotinaDatos, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    setForm((f) => {
      if (f.TablaBarbotinaDatos.length <= 0) return f;
      return { ...f, TablaBarbotinaDatos: f.TablaBarbotinaDatos.slice(0, -1) };
    });
  };
  const handleValidation = async () => {
    if (!turnoId) {
      setTurnoError('Selecciona un turno');
    } else {
      setTurnoError('');
    }
    const result = datosBarbotina.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'TablaBarbotinaDatos'
      );

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
        toast.error(res.message || 'Se guardo exitosamente');
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Barbotina Modal
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
              label="Equipo"
              type="text"
              name="equipo"
              value={form?.equipo || ''}
              onChange={updateBase}
              error={error.equipo}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Horometro inicio"
              type="number"
              name="horometro_inicio"
              value={form?.horometro_inicio || ''}
              onChange={updateBase}
              error={error.horometro_inicio}
            />
          </div>
          <div className="md:col-span-1 lg:col-span-6">
            <InputField
              label="Horometro fin"
              type="number"
              name="horometro_final"
              value={form?.horometro_final || ''}
              onChange={updateBase}
              error={error.horometro_final}
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
              {(form?.ObservacionesBarbotinaDatos ?? []).map((item, idx) => (
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
              Registrar datos
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
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                colSpan={8}
              >
                CARGANDO MOLINOS
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                colSpan={7}
              >
                DESCARGANDO MOLINOS
              </th>
            </tr>
            <tr className="border border-slate-300">
              <th className="text-center border-r border-slate-300" rowSpan={2}>
                MOLINO
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={3}
              >
                HORA INICIO
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={3}
              >
                HORA FIN
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Lugar uno"
                  type="text"
                  name="nombre_lugar_uno_cargando_molinos"
                  value={form?.nombre_lugar_uno_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.nombre_lugar_uno_cargando_molinos}
                />
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Lugar dos"
                  type="text"
                  name="nombre_lugar_dos_cargando_molinos"
                  value={form?.nombre_lugar_dos_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.nombre_lugar_dos_cargando_molinos}
                />
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Lugar tres"
                  type="text"
                  name="nombre_lugar_tres_cargando_molinos"
                  value={form?.nombre_lugar_tres_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.nombre_lugar_tres_cargando_molinos}
                />
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Lugar cuatro"
                  type="text"
                  name="nombre_lugar_cuarto_cargando_molinos"
                  value={form?.nombre_lugar_cuarto_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.nombre_lugar_cuarto_cargando_molinos}
                />
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                H2O
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                DEFLO
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                REOMA
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                DENS
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                VISC
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                RES
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={2}
              >
                FOSA
              </th>
              <th
                className="px-10 py-3 text-center border-r border-slate-300"
                rowSpan={3}
              >
                PRODUCTO
              </th>
            </tr>
            <tr className="border border-slate-300">
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Humedad uno"
                  type="number"
                  name="humedad_lugar_uno_cargando_molinos"
                  value={form?.humedad_lugar_uno_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.humedad_lugar_uno_cargando_molinos}
                />
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Humedad dos"
                  type="number"
                  name="humedad_lugar_dos_cargando_molinos"
                  value={form?.humedad_lugar_dos_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.humedad_lugar_dos_cargando_molinos}
                />
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Humedad tres"
                  type="number"
                  name="humedad_lugar_tres_cargando_molinos"
                  value={form?.humedad_lugar_tres_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.humedad_lugar_tres_cargando_molinos}
                />
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Humedad cuatro"
                  type="number"
                  name="humedad_lugar_cuarto_cargando_molinos"
                  value={form?.humedad_lugar_cuarto_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.humedad_lugar_cuarto_cargando_molinos}
                />
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                <InputField
                  label="Proveedor"
                  type="text"
                  name="deflo_proveerdo_cargando_molinos"
                  value={form?.deflo_proveerdo_cargando_molinos || ''}
                  onChange={updateBase}
                  error={error.deflo_proveerdo_cargando_molinos}
                />
              </th>
            </tr>
            <tr className="border border-slate-300">
              <th className="px-10 py-3 text-center border-r border-slate-300">
                TN
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                TN
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                TN
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                TN
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                TN
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                LITROS
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                KG
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                KG
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                G/ML
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                S
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                %
              </th>
              <th className="px-10 py-3 text-center border-r border-slate-300">
                N
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {form?.TablaBarbotinaDatos?.map((row, idx) => (
              <tr key={idx} className="border border-slate-300 p-3">
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="n_molino_cargando_molinos"
                    value={row.n_molino_cargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'n_molino_cargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.n_molino_cargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="time"
                    name="hora_inicio"
                    value={row.hora_inicio}
                    onChange={(e) => {
                      setCargaTabla(idx, 'hora_inicio', e.target.value);
                    }}
                    error={!!tablaError[idx]?.hora_inicio}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="time"
                    name="hora_final"
                    value={row.hora_final}
                    onChange={(e) => {
                      setCargaTabla(idx, 'hora_final', e.target.value);
                    }}
                    error={!!tablaError[idx]?.hora_final}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="tn_lugar_uno_cargando_molinos"
                    value={row.tn_lugar_uno_cargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'tn_lugar_uno_cargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.tn_lugar_uno_cargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="tn_lugar_dos_cargando_molinos"
                    value={row.tn_lugar_dos_cargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'tn_lugar_dos_cargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.tn_lugar_dos_cargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="tn_lugar_tres_cargando_molinos"
                    value={row.tn_lugar_tres_cargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'tn_lugar_tres_cargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.tn_lugar_tres_cargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="tn_lugar_cuantro_cargando_molinos"
                    value={row.tn_lugar_cuantro_cargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'tn_lugar_cuantro_cargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.tn_lugar_cuantro_cargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="h2o_cargando_molinos"
                    value={row.h2o_cargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'h2o_cargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.h2o_cargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="deflo_cargando_molinos"
                    value={row.deflo_cargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'deflo_cargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.deflo_cargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="reoma_cargando_molinos"
                    value={row.reoma_cargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'reoma_cargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.reoma_cargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="dens_descargando_molinos"
                    value={row.dens_descargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'dens_descargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.dens_descargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="visc_descargando_molinos"
                    value={row.visc_descargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'visc_descargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.visc_descargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="number"
                    name="res_descargando_molinos"
                    value={row.res_descargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'res_descargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.res_descargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="text"
                    name="n_fosa_descargando_molinos"
                    value={row.n_fosa_descargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'n_fosa_descargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.n_fosa_descargando_molinos}
                  />
                </td>
                <td className="p-2 border-r border-slate-300">
                  <InputField
                    errorMode="border"
                    type="text"
                    name="producto_descargando_molinos"
                    value={row.producto_descargando_molinos}
                    onChange={(e) => {
                      setCargaTabla(
                        idx,
                        'producto_descargando_molinos',
                        e.target.value
                      );
                    }}
                    error={!!tablaError[idx]?.producto_descargando_molinos}
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
