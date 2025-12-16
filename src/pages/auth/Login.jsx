import LogoCeramicaCoboce from '../../img/logo-ceramica-coboce.png';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { useState } from 'react';

export default function Login() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda: login */}
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
          {/* Logo */}
          <div className="mb-6">
            <img
              src={LogoCeramicaCoboce}
              alt="logo"
              className="h-10 w-20 rounded object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold mb-1">Bienvenido de nuevo</h1>
          <p className="text-sm text-slate-500 mb-6">
            Inicia sesión para acceder a tu cuenta.
          </p>
          {/* Correo */}
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Usuario
          </label>

          <input
            type="email"
            className="w-full mb-4 rounded-lg border border-slate-300 px-3 py-2  text-sm h-11 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            placeholder="Usuario"
          />
          {/* Contraseña */}
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contraseña
          </label>
          <div className="relative w-full">
            <input
              type={show ? 'text' : 'password'}
              className="w-full mb-5 rounded-lg border border-slate-300 px-3 py-2 pr-10 text-sm h-11 leading-none focus:outline-none focus:ring-2 focus:ring-emerald-700"
              placeholder="Introduce tu contraseña"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute top-5 -translate-y-1/2 right-3 text-slate-500 hover:text-slate-700"
            >
              {show ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {/* Botón */}
          <button className="w-full rounded-lg bg-emerald-800 py-2.5 text-sm font-medium text-white hover:bg-emerald-900">
            Iniciar sesión
          </button>
        </div>
      </div>
      <div className="hidden md:flex flex-1 bg-emerald-800 items-center justify-center px-10">
        <div className="w-full max-w-xl bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8">
          {/* Etiqueta pequeña arriba */}
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-2">
            Cultura
          </p>

          {/* Título principal */}
          <h2 className="text-2xl font-semibold mb-3 text-emerald-900">
            Reglas de Oro
          </h2>

          {/* Frase introductoria */}
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            La puntualidad habla de tu compromiso y respeto por los demás. Ten
            en cuenta:
          </p>

          {/* Lista de reglas */}
          <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700 mb-4">
            <li>Si llegas cinco minutos antes, estás a tiempo.</li>
            <li>Si llegas justo a la hora, es tarde.</li>
            <li>Si llegas tarde, no puedes ingresar.</li>
            <li>
              Ser puntual es:
              <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                <li>Orden</li>
                <li>Respeto</li>
                <li>Responsabilidad</li>
                <li>Disciplina</li>
                <li>Actitud positiva</li>
              </ul>
            </li>
          </ul>

          {/* Frase de cierre */}
          <p className="text-xs text-slate-500 italic">
            “La puntualidad es la cortesía de los reyes y la disciplina de los
            equipos profesionales.”
          </p>
        </div>
      </div>
    </div>
  );
}
