import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { adminNav } from '../pages/admin/adminNav.js';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const BRAND = {
  name: 'Respawn Admin',
  logo: (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white font-bold shadow-sm">
      R
    </div>
  ),
};

function findGroupFromPath(pathname) {
  for (const g of adminNav) {
    if (g.items.some((it) => pathname.startsWith(it.to))) return g.id;
  }
  return 'general';
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const activeGroup = useMemo(
    () => findGroupFromPath(location.pathname),
    [location.pathname]
  );

  const [openGroup, setOpenGroup] = useState(activeGroup);

  useEffect(() => {
    setOpenGroup(activeGroup);
  }, [activeGroup]);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">{BRAND.logo}</div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{BRAND.name}</p>
              <p className="text-xs text-slate-500">Panel de administración</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <div className="h-8 w-8 rounded-xl bg-linear-to-br from-indigo-500 to-fuchsia-500" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">Admin</p>
                <p className="text-xs text-slate-500">admin@cns.bo</p>
              </div>
            </div>

            <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ✅ CONTENEDOR FLEX (Sidebar + Main) */}
      <div className="flex h-[calc(100vh-4rem)] min-h-0">
        {/* Sidebar */}
        <aside
          className={cx(
            'h-full border-r border-slate-200/70 bg-white/70 backdrop-blur transition-all duration-300',
            sidebarOpen ? 'w-72' : 'w-19'
          )}
        >
          {/* ✅ min-h-0 para que el scroll funcione en hijos */}
          <div className="flex h-full flex-col min-h-0">
            <div className="h-3" />

            {/* ✅ SOLO ESTA ZONA SCROLLEA */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 pb-3">
              <nav>
                {adminNav.map((group) => {
                  const GroupIcon = group.icon;
                  const isOpen = openGroup === group.id;

                  return (
                    <div key={group.id} className="mb-2">
                      <button
                        onClick={() =>
                          setOpenGroup((cur) =>
                            cur === group.id ? '' : group.id
                          )
                        }
                        className={cx(
                          'group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left',
                          'hover:bg-slate-100',
                          isOpen ? 'bg-slate-100' : 'bg-transparent'
                        )}
                      >
                        <GroupIcon className="h-6 w-6 shrink-0 text-slate-700" />

                        <div className={cx('flex-1', !sidebarOpen && 'hidden')}>
                          <p className="text-sm font-semibold">{group.title}</p>
                        </div>

                        <div className={cx(!sidebarOpen && 'hidden')}>
                          {isOpen ? (
                            <ChevronDownIcon className="h-5 w-5 text-slate-500" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5 text-slate-500" />
                          )}
                        </div>
                      </button>

                      {/* Sub items */}
                      <div
                        className={cx(
                          'mt-1 overflow-hidden transition-all duration-300',
                          isOpen && sidebarOpen ? 'max-h-120' : 'max-h-0'
                        )}
                      >
                        <div className="ml-3 border-l border-slate-200 pl-3">
                          {group.items.map((item) => {
                            const ItemIcon = item.icon;
                            const active = location.pathname.startsWith(
                              item.to
                            );

                            return (
                              <NavLink
                                key={`${group.id}:${item.to}`}
                                to={item.to}
                                className={({ isActive }) =>
                                  cx(
                                    'mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm',
                                    isActive
                                      ? 'bg-green-900 text-white shadow-sm'
                                      : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-700'
                                  )
                                }
                                end
                              >
                                <ItemIcon
                                  className={cx(
                                    'h-5 w-5 shrink-0',
                                    active ? 'text-white' : 'text-slate-500'
                                  )}
                                />
                                <span className="truncate">{item.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
