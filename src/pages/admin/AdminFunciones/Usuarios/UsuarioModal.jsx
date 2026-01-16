import InputField from '@components/InputField';
import PasswordField from '@components/PasswordField';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getRoles } from '@service/auth/Rol.services';

const initialForm = {
  username: '',
  password: '',
  roleIds: [],
};

export default function UsuarioModal({
  open,
  onClose,
  onSave,
  isEdit = false,
  id,
  fetchById,
}) {
  const [loading, setLoading] = useState(false);

  // form base
  const [form, setForm] = useState(initialForm);

  // catálogo roles
  const [rolesCat, setRolesCat] = useState([]);

  // UI helpers
  const [roleSel, setRoleSel] = useState(''); // string id
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
      setRoleSel('');
      setSearch('');

      try {
        // 1) catálogo roles
        const rolesRes = await getRoles();
        if (!active) return;

        if (!rolesRes?.ok) {
          throw new Error(rolesRes?.message || 'No se pudo cargar roles');
        }

        const list = rolesRes?.roles ?? rolesRes?.datos?.data ?? [];
        const rolesArr = Array.isArray(list) ? list : [];
        setRolesCat(rolesArr);

        // 2) si es NUEVO
        if (!isEdit) {
          setForm(initialForm);
          return;
        }

        // 3) si es EDITAR
        if (!id || typeof fetchById !== 'function') {
          setForm(initialForm);
          return;
        }

        const data = await fetchById(id);
        if (!active) return;

        if (!data?.ok) {
          throw new Error(data?.message || 'No se pudo cargar el usuario');
        }

        // Puede venir {dato:{...}} o {dato:[{...}]}
        const dto = Array.isArray(data?.dato) ? data.dato?.[0] : data?.dato;

        // roleIds puede venir como [1,2] o [{id:1},{id:2}]
        const raw = dto?.roleIds ?? dto?.roles ?? [];
        const roleIds = Array.isArray(raw)
          ? raw
              .map((r) => {
                if (typeof r === 'number') return r;
                if (typeof r === 'string' && /^\d+$/.test(r)) return Number(r);
                if (r?.id) return Number(r.id);
                return null;
              })
              .filter((x) => Number.isFinite(x))
          : [];

        setForm({
          username: dto?.username ?? '',
          password: '', // en edición normalmente NO se rellena por seguridad
          roleIds,
        });
      } catch (e) {
        toast.error(e?.message || 'Error del servidor');
        setForm(initialForm);
        setRolesCat([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [open, isEdit, id, fetchById]);

  // ====== helpers (HOOKS) ======
  const rolesMap = useMemo(() => {
    const m = new Map();
    (rolesCat || []).forEach((r) => m.set(Number(r.id), r));
    return m;
  }, [rolesCat]);

  const rolesFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rolesCat;
    return (rolesCat || []).filter((r) =>
      String(r?.nombre ?? '')
        .toLowerCase()
        .includes(q)
    );
  }, [rolesCat, search]);

  // ✅ cortar render después de hooks
  if (!open) return null;

  const updateBase = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const addRole = () => {
    const rid = Number(roleSel);
    if (!Number.isFinite(rid) || rid <= 0) {
      toast.error('Selecciona un rol');
      return;
    }

    setForm((f) => {
      if (f.roleIds.includes(rid)) return f;
      return { ...f, roleIds: [...f.roleIds, rid] };
    });

    setRoleSel('');
  };

  const removeRole = (rid) => {
    setForm((f) => ({ ...f, roleIds: f.roleIds.filter((x) => x !== rid) }));
  };

  const toggleRole = (rid) => {
    setForm((f) => {
      const exists = f.roleIds.includes(rid);
      return {
        ...f,
        roleIds: exists
          ? f.roleIds.filter((x) => x !== rid)
          : [...f.roleIds, rid],
      };
    });
  };

  const guardar = () => {
    if (!form.username.trim()) {
      setError((e) => ({ ...e, username: 'El usuario es obligatorio' }));
      toast.error('Completa el nombre de usuario');
      return;
    }

    // password requerido en creación; opcional en edición
    if (!isEdit && !form.password.trim()) {
      setError((e) => ({ ...e, password: 'La contraseña es obligatoria' }));
      toast.error('Completa la contraseña');
      return;
    }

    if (!Array.isArray(form.roleIds) || form.roleIds.length === 0) {
      toast.error('Selecciona al menos un rol');
      return;
    }

    const payload = {
      username: form.username.trim(),
      roleIds: form.roleIds, // [1,2]
      ...(form.password.trim() ? { password: form.password } : {}), // solo si se ingresó
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={() => {
          if (!loading) onClose();
        }}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 w-[92%] max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Editar usuario' : 'Nuevo usuario'}
          </h3>
          <button
            type="button"
            onClick={() => {
              if (!loading) onClose();
            }}
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
              {/* Datos usuario */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField
                    label="Nombre de usuario"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={updateBase}
                    error={error.username}
                  />

                  <PasswordField
                    label={isEdit ? 'Contraseña (opcional)' : 'Contraseña'}
                    name="password"
                    placeholder={
                      isEdit
                        ? 'Deja vacío si no deseas cambiarla'
                        : 'Introduce tu contraseña'
                    }
                    value={form.password}
                    onChange={updateBase}
                    error={error.password}
                  />
                </div>
              </div>

              {/* Roles */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-900">Roles</h4>

                  <InputField
                    label="Buscar"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ej: Administracion"
                    className="w-64"
                  />
                </div>

                {/* Selector + agregar */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-10">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Seleccionar rol
                    </label>

                    <select
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                      value={roleSel}
                      onChange={(e) => setRoleSel(e.target.value)}
                    >
                      <option value="">— Selecciona —</option>
                      {rolesFiltrados?.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={addRole}
                      className="w-full rounded-xl bg-emerald-800 px-3 py-2 text-white hover:bg-emerald-900"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                {/* Chips roles seleccionados */}
                <div className="mt-4">
                  {form.roleIds.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No seleccionaste roles todavía.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {form.roleIds.map((rid) => {
                        const r = rolesMap.get(Number(rid));
                        const label = r?.nombre ?? `Rol #${rid}`;
                        return (
                          <span
                            key={rid}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {label}
                            <button
                              type="button"
                              onClick={() => removeRole(rid)}
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
                    {(rolesFiltrados || []).map((r) => {
                      const checked = form.roleIds.includes(Number(r.id));
                      return (
                        <label
                          key={r.id}
                          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleRole(Number(r.id))}
                          />
                          <span className="text-slate-700">{r.nombre}</span>
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
