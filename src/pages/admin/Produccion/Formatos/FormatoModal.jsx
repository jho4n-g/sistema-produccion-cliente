import InputField from '@components/InputField';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { DatosFormato } from '@schema/Produccion/Seccion/Formato.schema.js';

import { getObjs } from '@service/Produccion/Secciones/Lineas.services';

const initialForm = {
  nombre_formato: '',
  caja_metros: '',
  caja_piezas: '',
  piezas_metro: '',
};

function norm(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase();
}

export default function FormatoModal({
  open,
  onClose,
  onSave,
  isEdit = false,
  id,
  fetchById,
}) {
  const [loading, setLoading] = useState(false);

  // catálogo líneas
  const [lineas, setLineas] = useState([]);

  // form base (controlado)
  const [form, setForm] = useState(initialForm);

  // detalles (guardaremos como [{linea_id, cantidad}])
  const [detalles, setDetalles] = useState([]);

  // selección para agregar detalle
  const [lineaSel, setLineaSel] = useState(''); // string id
  const [cantidadSel, setCantidadSel] = useState(1);

  // errores zod
  const [error, setError] = useState({});

  // cargar líneas + (si edita) cargar formato
  useEffect(() => {
    if (!open) return;

    let active = true;

    (async () => {
      setLoading(true);
      setError({});
      setLineaSel('');
      setCantidadSel(1);

      try {
        // 1) cargar líneas
        const res = await getObjs();
        if (!active) return;

        if (!res?.ok) {
          throw new Error(res?.message || 'No se pudo cargar líneas');
        }

        const dataLineas = res?.datos?.data ?? [];
        const lineasArr = Array.isArray(dataLineas) ? dataLineas : [];
        setLineas(lineasArr);

        // 2) si es nuevo
        if (!isEdit) {
          setForm(initialForm);
          setDetalles([]);
          return;
        }

        // 3) si es editar
        if (!id || typeof fetchById !== 'function') {
          setForm(initialForm);
          setDetalles([]);
          return;
        }

        const dataFormato = await fetchById(id);
        if (!active) return;

        if (!dataFormato?.ok) {
          throw new Error(
            dataFormato?.message || 'No se pudo cargar el formato'
          );
        }

        // tu API: dato es un ARRAY
        const dto = dataFormato?.dato?.[0] ?? null;

        if (!dto) {
          setForm(initialForm);
          setDetalles([]);
          return;
        }

        // mapear campos API -> form
        setForm({
          // tu API: "nombre", tu form: "nombre_formato"
          nombre_formato: dto?.nombre ?? '',
          caja_metros: dto?.caja_metros ?? '',
          caja_piezas: dto?.caja_piezas ?? '',
          piezas_metro: dto?.piezas_metro ?? '',
        });

        // mapear detalles API -> detalles UI
        // API: [{linea:"Linea b", alias:"Pequeña", cantidad:6}]
        // UI:  [{linea_id:2, cantidad:6}]  (buscando en catálogo)
        const incomingDetalles = Array.isArray(dto?.detalles)
          ? dto.detalles
          : [];

        const mappedDetalles = incomingDetalles
          .map((d) => {
            const alias = norm(d?.alias);
            const nombre = norm(d?.linea);

            const found = lineasArr.find((l) => {
              const a = norm(l?.alias);
              const n = norm(l?.nombre);
              return (alias && a === alias) || (nombre && n === nombre);
            });

            if (!found?.id) return null;

            const cantidad = Number(d?.cantidad ?? 0);
            if (!Number.isFinite(cantidad) || cantidad <= 0) return null;

            return { linea_id: Number(found.id), cantidad };
          })
          .filter(Boolean);

        setDetalles(mappedDetalles);

        if (incomingDetalles.length > mappedDetalles.length) {
          toast.warn(
            'Algunas líneas del formato no se pudieron relacionar con el catálogo (revisa nombres/alias).'
          );
        }
      } catch (e) {
        toast.error(e?.message || 'Error al cargar datos');
        setForm(initialForm);
        setDetalles([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, isEdit, id, fetchById]);

  // helper para mostrar “Nombre — Alias”
  const labelLinea = useMemo(() => {
    const map = new Map(lineas.map((l) => [String(l.id), l]));
    return (idVal) => {
      const l = map.get(String(idVal));
      if (!l) return '';
      return `${l.nombre} — ${l.alias}`;
    };
  }, [lineas]);

  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const agregarDetalle = () => {
    if (!lineaSel) {
      toast.error('Selecciona una línea');
      return;
    }

    const linea_id = Number(lineaSel);
    const cantidad = Number(cantidadSel);

    if (!Number.isFinite(linea_id) || linea_id <= 0) {
      toast.error('Línea inválida');
      return;
    }

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      toast.error('Cantidad inválida');
      return;
    }

    // si ya existe la línea en detalles, sumamos cantidad
    setDetalles((prev) => {
      const idx = prev.findIndex((d) => Number(d.linea_id) === linea_id);
      if (idx === -1) return [...prev, { linea_id, cantidad }];

      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        cantidad: Number(copy[idx].cantidad) + cantidad,
      };
      return copy;
    });

    setLineaSel('');
    setCantidadSel(1);
  };

  const eliminarDetalle = (linea_id) => {
    setDetalles((prev) =>
      prev.filter((d) => Number(d.linea_id) !== Number(linea_id))
    );
  };

  const guardar = () => {
    const payload = { ...form, detalles };

    const result = DatosFormato.safeParse(payload);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setError(fieldErrors);
      toast.error('Datos incorrectos');
      if (detalles.length === 0) toast.error('Agrega al menos una línea');
      return;
    }

    const data = result.data;

    // en edición, normalmente conviene incluir el id
    onSave(isEdit ? { id, ...data } : data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 w-[92%] max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Editar formato' : 'Nuevo formato'}
          </h3>
          <button
            type="button"
            onClick={loading ? undefined : onClose}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">
          {/* Loading */}
          {loading && (
            <div className="grid place-items-center rounded-2xl bg-white/75 py-10">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                <p className="text-sm font-semibold text-slate-800">
                  Cargando…
                </p>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* Datos formato */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Nombre formato"
                    type="text"
                    name="nombre_formato"
                    value={form?.nombre_formato ?? ''}
                    onChange={updateBase}
                    error={error.nombre_formato}
                  />
                  <InputField
                    label="Caja metros"
                    type="number"
                    name="caja_metros"
                    value={form?.caja_metros ?? ''}
                    onChange={updateBase}
                    error={error.caja_metros}
                  />
                  <InputField
                    label="Caja piezas"
                    type="number"
                    name="caja_piezas"
                    value={form?.caja_piezas ?? ''}
                    onChange={updateBase}
                    error={error.caja_piezas}
                  />
                  <InputField
                    label="Piezas metro"
                    type="number"
                    name="piezas_metro"
                    value={form?.piezas_metro ?? ''}
                    onChange={updateBase}
                    error={error.piezas_metro}
                  />
                </div>
              </div>

              {/* Detalles: elegir línea */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Detalles</h4>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-8">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Prensa
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                      value={lineaSel}
                      onChange={(e) => setLineaSel(e.target.value)}
                    >
                      <option value="">— Selecciona —</option>
                      {lineas?.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.nombre} — {l.alias}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <InputField
                      label="Cantidad"
                      type="number"
                      name="cantidad"
                      value={cantidadSel}
                      onChange={(e) => setCantidadSel(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={agregarDetalle}
                      className="w-full rounded-xl bg-emerald-800 px-3 py-2 text-white hover:bg-emerald-900"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Tabla detalles agregados */}
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm border-separate border-spacing-0">
                    <thead className="bg-slate-50">
                      <tr className="divide-x divide-slate-200">
                        <th className="border-b px-3 py-2 text-left font-semibold">
                          Línea
                        </th>
                        <th className="border-b px-3 py-2 text-left font-semibold">
                          Cantidad
                        </th>
                        <th className="border-b px-3 py-2 text-left font-semibold">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detalles.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-3 py-6 text-center text-slate-500"
                          >
                            No agregaste líneas todavía.
                          </td>
                        </tr>
                      ) : (
                        detalles.map((d) => (
                          <tr
                            key={d.linea_id}
                            className="divide-x divide-slate-200"
                          >
                            <td className="border-b px-3 py-2">
                              {labelLinea(d.linea_id)}
                            </td>
                            <td className="border-b px-3 py-2">{d.cantidad}</td>
                            <td className="border-b px-3 py-2">
                              <button
                                type="button"
                                onClick={() => eliminarDetalle(d.linea_id)}
                                className="rounded-xl bg-red-700 px-3 py-1.5 text-white hover:bg-red-900"
                              >
                                Quitar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  className="rounded-xl bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-200"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  className="rounded-xl bg-green-800 px-4 py-2 text-white hover:bg-green-900"
                  onClick={guardar}
                >
                  {isEdit ? 'Guardar cambios' : 'Guardar'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
