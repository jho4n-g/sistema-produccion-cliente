import LogoCeramicaCoboce from '../img/logo-ceramica-coboce.png';
import { NavLink } from 'react-router';
import { Outlet } from 'react-router';

export default function HomeUserPage() {
  return (
    <div className="min-h-screen bg-slate-100 ">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-14">
          {/* Logo + nombre */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 rounded-lg  flex items-center justify-center">
              <img
                src={LogoCeramicaCoboce}
                alt="logo"
                className="h-10 w-20 rounded object-cover"
              />
            </div>
          </div>

          {/* Menú */}
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/produccion/inicioBarbotina"
              className={({ isActive }) =>
                `pb-1 font-medium ${
                  isActive
                    ? 'text-emerald-800 border-b-2 border-emerald-800'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/produccion/llenadoPlanillaBarbotina"
              className={({ isActive }) =>
                `pb-1 font-medium ${
                  isActive
                    ? 'text-emerald-800 border-b-2 border-emerald-800'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Llenado de Planilla
            </NavLink>
            <NavLink
              to="/produccion/historialBarbotina"
              className={({ isActive }) =>
                `pb-1 font-medium ${
                  isActive
                    ? 'text-emerald-800 border-b-2 border-emerald-800'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Historial
            </NavLink>
          </nav>

          {/* Notificación + usuario */}
          <div className="flex items-center gap-4">
            <button className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              🔔
            </button>
            <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-300">
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                alt="User"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
