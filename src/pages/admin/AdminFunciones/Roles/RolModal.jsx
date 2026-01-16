import InputField from '@components/InputField';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getPermisos } from '@service/auth/Rol.services';

export default function RolModal({
  open,
  onClose,
  onSave,
  isEdit = false,
  id,
  fetchById,
}) {
  const [loading, setLoading] = useState(false);

  // form base
  const [form, setForm] = useState({ nombre: '', permisos: [] });

  // catálogo permisos
  const [permisosCat, setPermisosCat] = useState([]);

  // UI helpers
  const [permisoSel, setPermisoSel] = useState('');
  const [search, setSearch] = useState('');

  // errores
  const [error, setError] = useState({});

  // ====== Cargar data al abrir ======
  useEffect(() => {
    if (!open) return;

    let active = true;

    (async () => {
      setLoading(true);
      setError({});
      setPermisoSel('');
      setSearch('');

      try {
        const permisosRes = await getPermisos();
        if (!active) return;

        if (!permisosRes?.ok) {
          throw new Error(permisosRes?.message || 'No se pudo cargar permisos');
        }

        const list = permisosRes?.roles ?? permisosRes?.datos?.data ?? [];
        setPermisosCat(Array.isArray(list) ? list : []);

        if (!isEdit) {
          setForm({ nombre: '', permisos: [] });
          return;
        }

        if (!id || typeof fetchById !== 'function') {
          setForm({ nombre: '', permisos: [] });
          return;
        }

        const data = await fetchById(id);

        if (!active) return;

        if (!data?.ok) {
          throw new Error(data?.message || 'No se pudo cargar el rol');
        }

        const dto = Array.isArray(data?.dato) ? data.dato?.[0] : data?.dato;

        const rawPerms = dto?.permisos ?? [];
        const permisosIds = Array.isArray(rawPerms)
          ? rawPerms
              .map((p) => {
                if (typeof p === 'number') return p;
                if (typeof p === 'string' && /^\d+$/.test(p)) return Number(p);
                if (p?.id) return Number(p.id);
                return null;
              })
              .filter((x) => Number.isFinite(x))
          : [];

        setForm({
          nombre: dto?.nombre ?? '',
          permisos: permisosIds,
        });
      } catch (e) {
        toast.error(e?.message || 'Error del servidor');
        setForm({ nombre: '', permisos: [] });
        setPermisosCat([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, isEdit, id, fetchById]);

  // ====== helpers (HOOKS) ======
  const permisosMap = useMemo(() => {
    const m = new Map();
    (permisosCat || []).forEach((p) => {
      m.set(Number(p.id), p);
    });
    return m;
  }, [permisosCat]);

  const permisosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return permisosCat;
    return (permisosCat || []).filter((p) =>
      String(p?.nombre ?? '')
        .toLowerCase()
        .includes(q)
    );
  }, [permisosCat, search]);

  // ✅ AHORA sí puedes cortar el render
  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const addPermiso = () => {
    const pid = Number(permisoSel);
    if (!Number.isFinite(pid) || pid <= 0) {
      toast.error('Selecciona un permiso');
      return;
    }

    setForm((f) => {
      if (f.permisos.includes(pid)) return f;
      return { ...f, permisos: [...f.permisos, pid] };
    });

    setPermisoSel('');
  };

  const removePermiso = (pid) => {
    setForm((f) => ({ ...f, permisos: f.permisos.filter((x) => x !== pid) }));
  };

  const togglePermiso = (pid) => {
    setForm((f) => {
      const exists = f.permisos.includes(pid);
      return {
        ...f,
        permisos: exists
          ? f.permisos.filter((x) => x !== pid)
          : [...f.permisos, pid],
      };
    });
  };

  const guardar = () => {
    if (!form?.nombre?.trim()) {
      setError((e) => ({ ...e, nombre: 'El nombre es obligatorio' }));
      toast.error('Completa el nombre del rol');
      return;
    }
    if (!Array.isArray(form.permisos) || form.permisos.length === 0) {
      toast.error('Selecciona al menos un permiso');
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      permisos: form.permisos,
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
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Editar Rol' : 'Nuevo Rol'}
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
          {loading && (
            <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-white/75 backdrop-blur">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                <p className="text-sm font-semibold text-slate-800">
                  Procesando…
                </p>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {/* Datos rol */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputField
                    label="Nombre del rol"
                    type="text"
                    name="nombre"
                    value={form?.nombre ?? ''}
                    onChange={updateBase}
                    error={error.nombre}
                  />
                </div>
              </div>

              {/* Permisos */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-900">Permisos</h4>

                  <div className="flex items-center gap-2">
                    <InputField
                      label="Buscar"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Ej: Atomizado"
                      className="w-64"
                    />
                  </div>
                </div>

                {/* Selector + agregar */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-10">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Seleccionar permiso
                    </label>

                    <select
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                      value={permisoSel}
                      onChange={(e) => setPermisoSel(e.target.value)}
                    >
                      <option value="">— Selecciona —</option>
                      {permisosFiltrados?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={addPermiso}
                      className="w-full rounded-xl bg-emerald-800 px-3 py-2 text-white hover:bg-emerald-900"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Chips permisos seleccionados */}
                <div className="mt-4">
                  {form.permisos.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No seleccionaste permisos todavía.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {form.permisos.map((pid) => {
                        const p = permisosMap.get(Number(pid));
                        const label = p?.nombre ?? `Permiso #${pid}`;
                        return (
                          <span
                            key={pid}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {label}
                            <button
                              type="button"
                              onClick={() => removePermiso(pid)}
                              className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700 hover:bg-slate-300"
                              aria-label={`Quitar ${label}`}
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Lista checkbox */}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    Selección rápida
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(permisosFiltrados || []).map((p) => {
                      const checked = form.permisos.includes(Number(p.id));
                      return (
                        <label
                          key={p.id}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermiso(Number(p.id))}
                          />
                          <span className="text-slate-700">{p.nombre}</span>
                        </label>
                      );
                    })}
                  </div>
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
