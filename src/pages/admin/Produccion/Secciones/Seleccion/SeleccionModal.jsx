import { useState, useEffect } from 'react';
import { DatosEmbalaje } from '../../../../../schema/Produccion/Seccion/SeleccionEmbalaje';
import { extractArrayFieldErrors } from '../../../../../helpers/normalze.helpers';
import InputField from '../../../../../components/InputField';
import { toast } from 'react-toastify';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NuevaFilaTabla = () => ({
  hora: '',
  tipo_concepto: '',
  a1: '',
  a2: '',
  a3: '',
  b1: '',
  b2: '',
  b3: '',
  c1: '',
  c2: '',
  c3: '',
  d1: '',
  d2: '',
  d3: '',
  cajas_segunda: '',
  defecto_segundaN1: '',
  defecto_segundaN2: '',
  defecto_segundaN3: '',
  defecto_segundaN4: '',
  defecto_segundaN5: '',
  defecto_segundaN6: '',
  defecto_segundaN7: '',
  defecto_segundaN8: '',
  defecto_segundaN9: '',
  defecto_segundaN10: '',
  cajas_tercera: '',
  defecto_terceraN1: '',
  defecto_terceraN2: '',
  defecto_terceraN3: '',
  defecto_terceraN4: '',
  defecto_terceraN5: '',
  defecto_terceraN6: '',
  defecto_terceraN7: '',
  cajas_casco: '',
  defecto_cascoN1: '',
  defecto_cascoN2: '',
  defecto_cascoN3: '',
  defecto_cascoN4: '',
  espacio_min: '',
});
const rows = 8;

export default function SelecccionModal({
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
        console.log('selecicon', data);
        if (!active) return;
        // console.log('atimizado', data);
        if (data?.ok) setForm(data.datos ?? {});
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
      observacion_embalaje: [
        ...(f.observacion_embalaje ?? []),
        { observacion: v },
      ],
    }));
    setObsInput('');
  };

  const removeObs = (index) => {
    setForm((f) => ({
      ...f,
      observacion_embalaje: f.observacion_embalaje.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const setCargaTabla = (idx, field, value) => {
    setForm((f) => {
      const rows = Array.isArray(f?.tabla_seleccion_embalaje)
        ? [...f.tabla_seleccion_embalaje]
        : [];
      if (idx < 0 || idx >= rows.length) return f; // evita índices fuera de rango
      rows[idx] = { ...(rows[idx] ?? {}), [field]: value };
      return { ...f, tabla_seleccion_embalaje: rows };
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
      if (f.tabla_seleccion_embalaje.length >= rows) return f;
      return {
        ...f,
        tabla_seleccion_embalaje: [
          ...f.tabla_seleccion_embalaje,
          NuevaFilaTabla(),
        ],
      };
    });
  };

  const removeRows = () => {
    setForm((f) => {
      if (f.tabla_seleccion_embalaje.length <= 0) return f;
      return {
        ...f,
        tabla_seleccion_embalaje: f.tabla_seleccion_embalaje.slice(0, -1),
      };
    });
  };

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };
  const handleValidation = async () => {
    const result = DatosEmbalaje.safeParse(form);
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
                Seleccion Modal
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
                    label="Producto"
                    type="text"
                    name="producto"
                    value={form?.producto || ''}
                    onChange={updateBase}
                    error={error.producto}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Horno"
                    type="text"
                    name="horno"
                    value={form?.horno || ''}
                    onChange={updateBase}
                    error={error.horno}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Formato"
                    type="text"
                    name="formato"
                    value={form?.formato || ''}
                    onChange={updateBase}
                    error={error.formato}
                  />
                </div>
                <div className="md:col-span-1 lg:col-span-6">
                  <InputField
                    label="Grupo"
                    type="text"
                    name="grupo"
                    value={form?.grupo || ''}
                    onChange={updateBase}
                    error={error.grupo}
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
                    {(form?.observacion_embalaje ?? []).map((item, idx) => (
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
                      rowSpan={2}
                    >
                      HORA
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={13}
                    >
                      PRIMERA (CAJA) TONO - CALIBRE
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      SEGUNDA
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={10}
                    >
                      DEFECTOS (PIEZAS)
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      TERCERA
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={7}
                    >
                      DEFECTOS (PIEZAS)
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      CASCO
                    </th>
                    <th
                      className="px-10 py-3 text-center border-r border-slate-300"
                      colSpan={4}
                    >
                      DEFECTOS (PIEZAS)
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      ESPACIO
                    </th>
                  </tr>
                  <tr className="border border-slate-300">
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      TIPO
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      A1
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      A2
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      A3
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      B1
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      B2
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      B3
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      C1
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      C2
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      C3
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      D1
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      D2
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      D3
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      CAJAS
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN1"
                        value={form?.segunda_defectoN1 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN1}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN2"
                        value={form?.segunda_defectoN2 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN2}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN3"
                        value={form?.segunda_defectoN3 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN3}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN4"
                        value={form?.segunda_defectoN4 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN4}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN5"
                        value={form?.segunda_defectoN5 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN5}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN6"
                        value={form?.segunda_defectoN6 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN6}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN7"
                        value={form?.segunda_defectoN7 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN7}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN8"
                        value={form?.segunda_defectoN8 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN8}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN9"
                        value={form?.segunda_defectoN9 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN9}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="segunda_defectoN10"
                        value={form?.segunda_defectoN10 || ''}
                        onChange={updateBase}
                        error={error.segunda_defectoN10}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      CAJAS
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN1"
                        value={form?.tercera_defectoN1 || ''}
                        onChange={updateBase}
                        error={error.tercera_defectoN1}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN2"
                        value={form?.tercera_defectoN2 || ''}
                        onChange={updateBase}
                        error={error.tercera_defectoN2}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN3"
                        value={form?.tercera_defectoN3 || ''}
                        onChange={updateBase}
                        error={error.tercera_defectoN3}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN4"
                        value={form?.tercera_defectoN4 || ''}
                        onChange={updateBase}
                        error={error.tercera_defectoN4}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN5"
                        value={form?.tercera_defectoN5 || ''}
                        onChange={updateBase}
                        error={error.tercera_defectoN5}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN6"
                        value={form?.tercera_defectoN6 || ''}
                        onChange={updateBase}
                        error={error.tercera_defectoN6}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="tercera_defectoN7"
                        value={form?.tercera_defectoN7 || ''}
                        onChange={updateBase}
                        error={error.tercera_defectoN7}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      CAJAS
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="casco_defectoN1"
                        value={form?.casco_defectoN1 || ''}
                        onChange={updateBase}
                        error={error.casco_defectoN1}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="casco_defectoN2"
                        value={form?.casco_defectoN2 || ''}
                        onChange={updateBase}
                        error={error.casco_defectoN2}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="casco_defectoN3"
                        value={form?.casco_defectoN3 || ''}
                        onChange={updateBase}
                        error={error.casco_defectoN3}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      <InputField
                        type="number"
                        name="casco_defectoN4"
                        value={form?.casco_defectoN4 || ''}
                        onChange={updateBase}
                        error={error.casco_defectoN4}
                      />
                    </th>
                    <th className="px-10 py-3 text-center border-r border-slate-300">
                      (Min.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {form?.tabla_seleccion_embalaje?.map((row, idx) => (
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
                          type="text"
                          name="tipo_concepto"
                          value={row.tipo_concepto}
                          onChange={(e) => {
                            setCargaTabla(idx, 'tipo_concepto', e.target.value);
                          }}
                          error={!!tablaError[idx]?.tipo_concepto}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="a1"
                          value={row.a1}
                          onChange={(e) => {
                            setCargaTabla(idx, 'a1', e.target.value);
                          }}
                          error={!!tablaError[idx]?.a1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="a2"
                          value={row.a2}
                          onChange={(e) => {
                            setCargaTabla(idx, 'a2', e.target.value);
                          }}
                          error={!!tablaError[idx]?.a2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="a3"
                          value={row.a3}
                          onChange={(e) => {
                            setCargaTabla(idx, 'a3', e.target.value);
                          }}
                          error={!!tablaError[idx]?.a3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="b1"
                          value={row.b1}
                          onChange={(e) => {
                            setCargaTabla(idx, 'b1', e.target.value);
                          }}
                          error={!!tablaError[idx]?.b1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="b2"
                          value={row.b2}
                          onChange={(e) => {
                            setCargaTabla(idx, 'b2', e.target.value);
                          }}
                          error={!!tablaError[idx]?.b2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="b3"
                          value={row.b3}
                          onChange={(e) => {
                            setCargaTabla(idx, 'b3', e.target.value);
                          }}
                          error={!!tablaError[idx]?.b3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="c1"
                          value={row.c1}
                          onChange={(e) => {
                            setCargaTabla(idx, 'c1', e.target.value);
                          }}
                          error={!!tablaError[idx]?.c1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="c2"
                          value={row.c2}
                          onChange={(e) => {
                            setCargaTabla(idx, 'c2', e.target.value);
                          }}
                          error={!!tablaError[idx]?.c2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="c3"
                          value={row.c3}
                          onChange={(e) => {
                            setCargaTabla(idx, 'c3', e.target.value);
                          }}
                          error={!!tablaError[idx]?.c3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="d1"
                          value={row.d1}
                          onChange={(e) => {
                            setCargaTabla(idx, 'd1', e.target.value);
                          }}
                          error={!!tablaError[idx]?.d1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="d2"
                          value={row.d2}
                          onChange={(e) => {
                            setCargaTabla(idx, 'd2', e.target.value);
                          }}
                          error={!!tablaError[idx]?.d2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="d3"
                          value={row.d3}
                          onChange={(e) => {
                            setCargaTabla(idx, 'd3', e.target.value);
                          }}
                          error={!!tablaError[idx]?.d3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="cajas_segunda"
                          value={row.cajas_segunda}
                          onChange={(e) => {
                            setCargaTabla(idx, 'cajas_segunda', e.target.value);
                          }}
                          error={!!tablaError[idx]?.cajas_segunda}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN1"
                          value={row.defecto_segundaN1}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN1',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN2"
                          value={row.defecto_segundaN2}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN2',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN3"
                          value={row.defecto_segundaN3}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN3',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN4"
                          value={row.defecto_segundaN4}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN4',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN4}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN5"
                          value={row.defecto_segundaN5}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN5',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN5}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN6"
                          value={row.defecto_segundaN6}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN6',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN6}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN7"
                          value={row.defecto_segundaN7}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN7',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN7}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN8"
                          value={row.defecto_segundaN8}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN8',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN8}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN9"
                          value={row.defecto_segundaN9}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN9',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN9}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_segundaN10"
                          value={row.defecto_segundaN10}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_segundaN10',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_segundaN10}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="cajas_tercera"
                          value={row.cajas_tercera}
                          onChange={(e) => {
                            setCargaTabla(idx, 'cajas_tercera', e.target.value);
                          }}
                          error={!!tablaError[idx]?.cajas_tercera}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_terceraN1"
                          value={row.defecto_terceraN1}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_terceraN1',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_terceraN1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_terceraN2"
                          value={row.defecto_terceraN2}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_terceraN2',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_terceraN2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_terceraN3"
                          value={row.defecto_terceraN3}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_terceraN3',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_terceraN3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_terceraN4"
                          value={row.defecto_terceraN4}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_terceraN4',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_terceraN4}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_terceraN5"
                          value={row.defecto_terceraN5}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_terceraN5',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_terceraN5}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_terceraN6"
                          value={row.defecto_terceraN6}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_terceraN6',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_terceraN6}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_terceraN7"
                          value={row.defecto_terceraN7}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_terceraN7',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_terceraN7}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="cajas_casco"
                          value={row.cajas_casco}
                          onChange={(e) => {
                            setCargaTabla(idx, 'cajas_casco', e.target.value);
                          }}
                          error={!!tablaError[idx]?.cajas_casco}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_cascoN1"
                          value={row.defecto_cascoN1}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_cascoN1',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_cascoN1}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_cascoN2"
                          value={row.defecto_cascoN2}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_cascoN2',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_cascoN2}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_cascoN3"
                          value={row.defecto_cascoN3}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_cascoN3',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_cascoN3}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="defecto_cascoN4"
                          value={row.defecto_cascoN4}
                          onChange={(e) => {
                            setCargaTabla(
                              idx,
                              'defecto_cascoN4',
                              e.target.value
                            );
                          }}
                          error={!!tablaError[idx]?.defecto_cascoN4}
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        <InputField
                          errorMode="border"
                          type="number"
                          name="espacio_min"
                          value={row.espacio_min}
                          onChange={(e) => {
                            setCargaTabla(idx, 'espacio_min', e.target.value);
                          }}
                          error={!!tablaError[idx]?.espacio_min}
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
