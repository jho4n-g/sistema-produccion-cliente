import { useState, useEffect } from 'react';
import { DatosAtomizado } from '../../../../../schema/Produccion/Seccion/Atomizado.schema';
import { extractArrayFieldErrors } from '../../../../../helpers/normalze.helpers';
import InputField from '../../../../../components/InputField';
import { toast } from 'react-toastify';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
  humedad_uno: '',
  humedad_dos: '',
  humedad_tres: '',
  silo_descarga: '',
  producto: '',
  n_silo_llenos: '',
});

const initialForm = () => ({
  fecha: '',
  turno: '',
  operador: '',
  hora_inicio: '',
  hora_final: '',
  supervisor_turno: '',
  observacionesAtomizadoDatos: [],
  tabla_atomizado: [],
  control_granulometria: [],
  control_fosas: [],
});

export default function AtomizadoModal({
  open,
  onClose,
  onSave,
  fetchById,
  id,
}) {
  const [form, setForm] = useState(initialForm());
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

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };
  const handleValidation = async () => {
    const result = DatosAtomizado.safeParse(form);
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const tablaErrors = extractArrayFieldErrors(
        result.error,
        'tabla_atomizado'
      );

      setTablaError(tablaErrors);
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    } else {
      handleSave();
    }
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay (fondo) */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* Panel (contenido) */}
      <div className="relative z-10 w-[92%] max-w-7xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Atomizado Modal
          </h3>
        </div>
        <div className=" bg-white rounded-xl shadow p-6 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="col-span-2 ">
              <InputField
                label="Fecha"
                type="date"
                name="fecha"
                value={form.fecha || ''}
                onChange={updateBase}
                error={error.fecha}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Hora inicio"
                type="time"
                name="hora_inicio"
                value={form.hora_inicio || ''}
                onChange={updateBase}
                error={error.hora_inicio}
              />
            </div>
            <div className="col-span-2">
              <InputField
                label="Hora final"
                type="time"
                name="hora_final"
                value={form.hora_final || ''}
                onChange={updateBase}
                error={error.hora_final}
              />
            </div>
            <div className="col-span-3">
              <InputField
                label="Turno"
                type="text"
                name="turno"
                value={form.turno || ''}
                onChange={updateBase}
                error={error.turno}
              />
            </div>
            <div className="col-span-3">
              <InputField
                label="Operador"
                type="text"
                name="operador"
                value={form.operador || ''}
                onChange={updateBase}
                error={error.operador}
              />
            </div>
            <div className="col-span-3">
              <InputField
                label="Supervisor de turno"
                type="text"
                name="supervisor_turno"
                value={form.supervisor_turno || ''}
                onChange={updateBase}
                error={error.supervisor_turno}
              />
            </div>
            <div className="col-span-9" />
            <div className="col-span-5 ">
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
                    <span className="max-w-[320px] truncate">
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
            <div className="col-span-1 mt-6">
              <button
                className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900 flex items-start"
                onClick={addObs}
              >
                <PlusIcon className="h-5 w-5 " />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow my-5 px-5">
          <table className="min-w-750 text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wide">
              <tr className="border-b border-slate-300">
                <th
                  className=" text-center border-r border-slate-300"
                  rowSpan={2}
                >
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
              <tr className="border-b border-slate-300">
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
                  °N
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {form.tabla_atomizado?.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-300 p-3">
                  <td className="p-2 border-r border-slate-300">
                    <InputField
                      type="text"
                      name="hora"
                      value={row.hora}
                      onChange={(e) => {
                        setCargaTabla(idx, 'hora', e.target.value);
                      }}
                      error={!!tablaError[idx]?.hora}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end p-5">
          <button
            className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
            onClick={handleValidation}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
