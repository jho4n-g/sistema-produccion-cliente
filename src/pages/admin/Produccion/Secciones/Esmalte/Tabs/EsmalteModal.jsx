import { useState, useEffect } from 'react';
import { DatosEsmalte } from '../../../../../../schema/Produccion/Seccion/Esmalte.schema';
import { extractArrayFieldErrors } from '../../../../../../helpers/normalze.helpers';
import InputField from '../../../../../../components/InputField';
import { toast } from 'react-toastify';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
//

import Select from '../../../../../../components/Select';
import { getObjs } from '../../../../../../service/Produccion/Turno.services';

const NuevaFilaTabla = () => ({
  hora: '',
  operador_aplicacion_agua: '',
  sup_prod_aplicacion_agua: '',
  operador_aplicacion_engobe: '',
  sup_prod_aplicacion_engobe: '',
  operador_vizcosidad_normal: '',
  sup_prod_vizcosidad_normal: '',
  operador_densidad_recuperado: '',
  sup_prod_densidad_recuperado: '',
  operador_residuo_implemeable: '',
  sup_prod_residuo_implemeable: '',
  operador_aplicacion_esmalte: '',
  sup_prod_aplicacion_esmalte: '',
  operador_vizcosidad_brillante_recuperado: '',
  sup_prod_vizcosidad_brillante_recuperado: '',
  operador_densidad_transparente_satinado: '',
  sup_prod_densidad_transparente_satinado: '',
  operador_residuo_digital_blanco: '',
  sup_prod_residuo_digital_blanco: '',
});

const rows = 8;

export default function BarbotinaModal({
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

  const [turnoError, setTurnoError] = useState(null);
  const [turnoId, setTurnoId] = useState(null);

  useEffect(() => {
    if (!open || !id) return; // evita correr si no aplica

    let active = true; // evita setState tras unmount
    setLoading(true);

    (async () => {
      try {
        const data = await fetchById(id); // ← ahora sí esperamos aquí

        if (!active) return;

        if (data?.ok) {
          setForm(data.dato ?? {});
          setTurnoId(data?.dato?.turno_id ?? '');
        } else toast.error(data?.message || 'No se pudo cargar el registro');
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
    if (!v) return;
    setForm((f) => ({
      ...f,
      observaciones_esmalte: [
        ...(f.observaciones_esmalte ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    setForm((f) => ({
      ...f,
      observaciones_esmalte: f.observaciones_esmalte.filter(
        (_, i) => i !== index
      ),
    }));
  };
  const setCargaTabla = (idx, field, value) => {
    setForm((f) => {
      const rows = Array.isArray(f?.datos_tabla_esmalte)
        ? [...f.datos_tabla_esmalte]
        : [];
      if (idx < 0 || idx >= rows.length) return f; // evita índices fuera de rango
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, datos_tabla_esmalte: rows };
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
      if (f.datos_tabla_esmalte.length >= rows) return f;
      return {
        ...f,
        datos_tabla_esmalte: [...f.datos_tabla_esmalte, NuevaFilaTabla()],
      };
    });
  };

  const removeRows = () => {
    setForm((f) => {
      if (f.datos_tabla_esmalte.length <= 0) return f;
      return {
        ...f,
        datos_tabla_esmalte: f.datos_tabla_esmalte.slice(0, -1),
      };
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
    const result = DatosEsmalte.safeParse(form);
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
      const data = { turno_id: turnoId, ...result.data };
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
                    {(form?.observaciones_esmalte ?? []).map((item, idx) => (
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
              <table className="text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
                  <tr className="border border-slate-300">
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      rowSpan={3}
                    >
                      HORA
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      <InputField
                        label="Agua"
                        type="text"
                        name="agua_aplicacion"
                        value={form?.agua_aplicacion || ''}
                        onChange={updateBase}
                        error={error.agua_aplicacion}
                      />
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      ENGOBE
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      <InputField
                        label="Normal"
                        type="text"
                        name="normal_viscosidad"
                        value={form?.normal_viscosidad || ''}
                        onChange={updateBase}
                        error={error.normal_viscosidad}
                      />
                    </th>
                    <th
                      className="px-2 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      <InputField
                        label="Recuperado"
                        type="text"
                        name="recuperado_densidad"
                        value={form?.recuperado_densidad || ''}
                        onChange={updateBase}
                        error={error.recuperado_densidad}
                      />
                    </th>
                    <th
                      className="px-2 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      <InputField
                        label="Implemeable"
                        type="text"
                        name="implemeable_residuo"
                        value={form?.implemeable_residuo || ''}
                        onChange={updateBase}
                        error={error.implemeable_residuo}
                      />
                    </th>
                    <th
                      className="px-2 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      ESMALTE
                    </th>
                    <th className="px-2 py-3 text-center border-r border-slate-300">
                      <InputField
                        label="Brillante"
                        type="text"
                        name="brillante_viscosidad"
                        value={form?.brillante_viscosidad || ''}
                        onChange={updateBase}
                        error={error.brillante_viscosidad}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border-r border-slate-300">
                      <InputField
                        label="Recuperado"
                        type="text"
                        name="recuperado_viscosidad"
                        value={form?.recuperado_viscosidad || ''}
                        onChange={updateBase}
                        error={error.recuperado_viscosidad}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border-r border-slate-300">
                      <InputField
                        label="Transparente"
                        type="text"
                        name="tranparente_densidad"
                        value={form?.tranparente_densidad || ''}
                        onChange={updateBase}
                        error={error.tranparente_densidad}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border-r border-slate-300">
                      <InputField
                        label="Satinado"
                        type="text"
                        name="satinado_densidad"
                        value={form?.satinado_densidad || ''}
                        onChange={updateBase}
                        error={error.satinado_densidad}
                      />
                    </th>
                    <th className="px-2 py-3 text-center border-r border-slate-300">
                      <InputField
                        label="Digital"
                        type="text"
                        name="digital_residuo"
                        value={form?.digital_residuo || ''}
                        onChange={updateBase}
                        error={error.digital_residuo}
                      />
                    </th>
                    <th className="px-2 py-3  border-r border-slate-300">
                      <InputField
                        label="* "
                        type="text"
                        name="blanco_residuo"
                        value={form?.blanco_residuo || ''}
                        onChange={updateBase}
                        error={error.blanco_residuo}
                      />
                    </th>
                  </tr>
                  <tr className="border border-slate-300">
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      APLICACION [G]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      APLICACION [G]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      VIZCOCIDAD [S]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      DENSIDAD [G/CM²]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      RESIDUIO [%]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      APLICACION [G]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      VIZCOCIDAD [S]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      DENSIDAD [G/CM²]
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={2}
                    >
                      RESIDUIO [%]
                    </th>
                  </tr>
                  <tr className="border border-slate-300">
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      OPERADOR
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SUP. PROD.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {form?.datos_tabla_esmalte?.map((row, idx) => (
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
                          name="operador_aplicacion_agua"
                          value={row.operador_aplicacion_agua}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_aplicacion_agua',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_aplicacion_agua}
                        />
                      </td>
                      <td className=" border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sup_prod_aplicacion_agua"
                          value={row.sup_prod_aplicacion_agua}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_aplicacion_agua',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.sup_prod_aplicacion_agua}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_aplicacion_engobe"
                          value={row.operador_aplicacion_engobe}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_aplicacion_engobe',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_aplicacion_engobe}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sup_prod_aplicacion_engobe"
                          value={row.sup_prod_aplicacion_engobe}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_aplicacion_engobe',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.sup_prod_aplicacion_engobe}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_vizcosidad_normal"
                          value={row.operador_vizcosidad_normal}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_vizcosidad_normal',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_vizcosidad_normal}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sup_prod_vizcosidad_normal"
                          value={row.sup_prod_vizcosidad_normal}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_vizcosidad_normal',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.sup_prod_vizcosidad_normal}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_densidad_recuperado"
                          value={row.operador_densidad_recuperado}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_densidad_recuperado',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]?.operador_densidad_recuperado
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sup_prod_densidad_recuperado"
                          value={row.sup_prod_densidad_recuperado}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_densidad_recuperado',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]?.sup_prod_densidad_recuperado
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_residuo_implemeable"
                          value={row.operador_residuo_implemeable}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_residuo_implemeable',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]?.operador_residuo_implemeable
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sup_prod_residuo_implemeable"
                          value={row.sup_prod_residuo_implemeable}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_residuo_implemeable',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]?.sup_prod_residuo_implemeable
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_aplicacion_esmalte"
                          value={row.operador_aplicacion_esmalte}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_aplicacion_esmalte',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.operador_aplicacion_esmalte}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sup_prod_aplicacion_esmalte"
                          value={row.sup_prod_aplicacion_esmalte}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_aplicacion_esmalte',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.sup_prod_aplicacion_esmalte}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_vizcosidad_brillante_recuperado"
                          value={row.operador_vizcosidad_brillante_recuperado}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_vizcosidad_brillante_recuperado',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]
                              ?.operador_vizcosidad_brillante_recuperado
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sup_prod_vizcosidad_brillante_recuperado"
                          value={row.sup_prod_vizcosidad_brillante_recuperado}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_vizcosidad_brillante_recuperado',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]
                              ?.sup_prod_vizcosidad_brillante_recuperado
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_densidad_transparente_satinado"
                          value={row.operador_densidad_transparente_satinado}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_densidad_transparente_satinado',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]
                              ?.operador_densidad_transparente_satinado
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="sup_prod_densidad_transparente_satinado"
                          value={row.sup_prod_densidad_transparente_satinado}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_densidad_transparente_satinado',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]
                              ?.sup_prod_densidad_transparente_satinado
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_residuo_digital_blanco"
                          value={row.operador_residuo_digital_blanco}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'operador_residuo_digital_blanco',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]?.operador_residuo_digital_blanco
                          }
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="operador_residuo_digital_blanco"
                          value={row.sup_prod_residuo_digital_blanco}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'sup_prod_residuo_digital_blanco',
                              e.target.value
                            );
                          }}
                          error={
                            !!tablaError[idx]?.sup_prod_residuo_digital_blanco
                          }
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
