import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import InputField from '@components/InputField';
import { toast } from 'react-toastify';
import { extractArrayFieldErrors } from '@helpers/normalze.helpers';
import ConfirmModal from '@components/ConfirmModal';
import { registerObj } from '@service/Produccion/Secciones/Seleccion.services';
import { DatosEmbalaje } from '@schema/Produccion/Seccion/SeleccionEmbalaje';
//
import { getObjs } from '@service/Produccion/Turno.services';
import Select from '@components/Select';

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

const initialForm = () => ({
  casco_defectoN1: '',
  casco_defectoN2: '',
  casco_defectoN3: '',
  casco_defectoN4: '',
  fecha: '',
  formato: '',
  grupo: '',
  horno: '',
  operador: '',
  producto: '',
  segunda_defectoN1: '',
  segunda_defectoN2: '',
  segunda_defectoN3: '',
  segunda_defectoN4: '',
  segunda_defectoN5: '',
  segunda_defectoN6: '',
  segunda_defectoN7: '',
  segunda_defectoN8: '',
  segunda_defectoN9: '',
  segunda_defectoN10: '',
  supervisor_turno: '',
  tercera_defectoN1: '',
  tercera_defectoN2: '',
  tercera_defectoN3: '',
  tercera_defectoN4: '',
  tercera_defectoN5: '',
  tercera_defectoN6: '',
  tercera_defectoN7: '',
  turno: '',
  observacion_embalaje: [],
  tabla_seleccion_embalaje: [],
});

export default function Prensado() {
  const [form, setForm] = useState(initialForm());
  const [error, setError] = useState({});
  const [tablaError, setTablaError] = useState({});
  const [loading, setLoading] = useState(false);
  const [obsInput, setObsInput] = useState('');
  const [dataSave, setDataSave] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [turnoError, setTurnoError] = useState(null);
  const [turnoId, setTurnoId] = useState(null);

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
    if (!turnoId) {
      setTurnoError('Selecciona un turno');
    } else {
      setTurnoError('');
    }
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
      const data = { turno_id: turnoId, ...result.data };
      setDataSave(data);
      setOpenConfirm(true);
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await registerObj(dataSave);
      if (res.ok) {
        toast.success(res.message || 'Guardado exitosamente');
        setOpenConfirm(false);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al guardar');
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };
  return (
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
          <div className="md:col-span-2 lg:col-span-2 lg:pt-6">
            <button
              className="w-full rounded-xl bg-green-800 px-6 py-3 text-base font-semibold text-white hover:bg-green-900"
              onClick={handleValidation}
            >
              Guardar datos
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

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 ">
        <table className=" text-sm">
          <thead
            className="bg-slate-50 text-slate-600 
                    uppercase text-xs tracking-wide"
          >
            <tr className="border border-slate-300">
              <th
                className="sticky left-0 z-20 px-10 py-3 
                text-center border border-slate-300 bg-white"
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
              <th className="px-3 py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN1"
                  value={form?.segunda_defectoN1 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN1}
                />
              </th>
              <th className="px-3 py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN2"
                  value={form?.segunda_defectoN2 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN2}
                />
              </th>
              <th className="px-3   py-3 text-center border-r border-slate-300 ">
                <InputField
                  type="number"
                  name="segunda_defectoN3"
                  value={form?.segunda_defectoN3 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN3}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN4"
                  value={form?.segunda_defectoN4 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN4}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN5"
                  value={form?.segunda_defectoN5 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN5}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN6"
                  value={form?.segunda_defectoN6 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN6}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN7"
                  value={form?.segunda_defectoN7 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN7}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN8"
                  value={form?.segunda_defectoN8 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN8}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN9"
                  value={form?.segunda_defectoN9 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN9}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="segunda_defectoN10"
                  value={form?.segunda_defectoN10 || ''}
                  onChange={updateBase}
                  error={error.segunda_defectoN10}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                CAJAS
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="tercera_defectoN1"
                  value={form?.tercera_defectoN1 || ''}
                  onChange={updateBase}
                  error={error.tercera_defectoN1}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="tercera_defectoN2"
                  value={form?.tercera_defectoN2 || ''}
                  onChange={updateBase}
                  error={error.tercera_defectoN2}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="tercera_defectoN3"
                  value={form?.tercera_defectoN3 || ''}
                  onChange={updateBase}
                  error={error.tercera_defectoN3}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="tercera_defectoN4"
                  value={form?.tercera_defectoN4 || ''}
                  onChange={updateBase}
                  error={error.tercera_defectoN4}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="tercera_defectoN5"
                  value={form?.tercera_defectoN5 || ''}
                  onChange={updateBase}
                  error={error.tercera_defectoN5}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="tercera_defectoN6"
                  value={form?.tercera_defectoN6 || ''}
                  onChange={updateBase}
                  error={error.tercera_defectoN6}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
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
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="casco_defectoN1"
                  value={form?.casco_defectoN1 || ''}
                  onChange={updateBase}
                  error={error.casco_defectoN1}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="casco_defectoN2"
                  value={form?.casco_defectoN2 || ''}
                  onChange={updateBase}
                  error={error.casco_defectoN2}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
                <InputField
                  type="number"
                  name="casco_defectoN3"
                  value={form?.casco_defectoN3 || ''}
                  onChange={updateBase}
                  error={error.casco_defectoN3}
                />
              </th>
              <th className="px-3  py-3 text-center border-r border-slate-300">
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
                <td className="sticky left-0 z-20 p-2 border-r border-slate-300 bg-white">
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
                      setCargaTabla(idx, 'defecto_segundaN1', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN2', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN3', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN4', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN5', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN6', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN7', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN8', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN9', e.target.value);
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
                      setCargaTabla(idx, 'defecto_segundaN10', e.target.value);
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
                      setCargaTabla(idx, 'defecto_terceraN1', e.target.value);
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
                      setCargaTabla(idx, 'defecto_terceraN2', e.target.value);
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
                      setCargaTabla(idx, 'defecto_terceraN3', e.target.value);
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
                      setCargaTabla(idx, 'defecto_terceraN4', e.target.value);
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
                      setCargaTabla(idx, 'defecto_terceraN5', e.target.value);
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
                      setCargaTabla(idx, 'defecto_terceraN6', e.target.value);
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
                      setCargaTabla(idx, 'defecto_terceraN7', e.target.value);
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
                      setCargaTabla(idx, 'defecto_cascoN1', e.target.value);
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
                      setCargaTabla(idx, 'defecto_cascoN2', e.target.value);
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
                      setCargaTabla(idx, 'defecto_cascoN3', e.target.value);
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
                      setCargaTabla(idx, 'defecto_cascoN4', e.target.value);
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
      <ConfirmModal
        open={openConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleSave}
      />
    </>
  );
}
