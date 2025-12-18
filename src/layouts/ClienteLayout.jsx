import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import LogoCeramicaCoboce from '../img/logo-ceramica-coboce.png';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const navItems = [
  { to: '/produccion/inicio', label: 'Inicio' },
  { to: '/cliente/produccion/secciones', label: 'Planilla Producción' },
  { to: '/produccion/historialBarbotina', label: 'Historial Producción' },
];

export default function ClienteLyaout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!userRef.current) return;
      if (!userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const linkBase =
    'inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition-colors';
  const linkInactive = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
  const linkActive = 'bg-green-800 text-white ring-1 ring-emerald-200';

  return (
    <div className="min-h-screen bg-slate-100">
      {/* AppBar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden"
                aria-label="Abrir menú"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={LogoCeramicaCoboce}
                  alt="Coboce"
                  className="h-10 w-24 object-contain"
                />
                <div className="hidden sm:block leading-tight">
                  <div className="text-sm font-bold text-slate-900">
                    Producción
                  </div>
                  <div className="text-xs text-slate-500 -mt-0.5">
                    Barbotina
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Nav (desktop) */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) =>
                    cx(linkBase, isActive ? linkActive : linkInactive)
                  }
                >
                  {it.label}
                </NavLink>
              ))}
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              {/* Notificaciones */}
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
                aria-label="Notificaciones"
                title="Notificaciones"
              >
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.7 21a2 2 0 01-3.4 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* User */}
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 text-sm hover:bg-slate-100"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                >
                  <div className="h-9 w-9 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-slate-900 leading-4">
                      Usuario
                    </div>
                    <div className="text-xs text-slate-500">Operador</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className={cx(
                    'absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg',
                    userOpen ? 'block' : 'hidden'
                  )}
                  role="menu"
                >
                  <div className="px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">
                      Usuario
                    </div>
                    <div className="text-xs text-slate-500">
                      usuario@coboce.bo
                    </div>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
                    Perfil
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
                    Configuración
                  </button>
                  <div className="h-px bg-slate-100" />
                  <button className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50">
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile nav */}
          <div
            className={cx('lg:hidden pb-4', mobileOpen ? 'block' : 'hidden')}
          >
            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cx(
                      'rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    )
                  }
                >
                  {it.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-8xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
