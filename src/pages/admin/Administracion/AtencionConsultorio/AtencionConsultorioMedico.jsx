import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  deleteObj,
  getObjsUser,
  updateObj,
  registerObj,
} from '../../../../service/Administracion/AtencionConsultorio.services';
import ConfirmModal from '@components/ConfirmModal';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { normalizarFecha, normalize } from '@helpers/normalze.helpers';
import Select from '@components/Select';
import { getPeriodos } from '@service/auth/Gestion.services.js';
import AtencionConsultorioMedicoModal from './AtencionConsultorioMedicoModal';

export default function AtencionConsultorio() {
  const [query, setQuery] = useState('');
  const [row, setRow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [turnoId, setTurnoId] = useState(null);

  // paginado (cliente)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateConfirm, setOpenCreateConfirm] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState(null);

  //crear
  const handleCreate = () => {
    setOpenCreate(true);
  };
  const handleCreateComfirm = (payload) => {
    setOpenCreateConfirm(true);
    setPayloadCreate(payload);
  };

  const handleSaveCreate = async () => {
    try {
      setLoading(true);
      const res = await registerObj(payloadCreate);
      if (res.ok) {
        toast.success(res.message || 'Registro creado con éxito');
        reload();
        setOpenCreateConfirm(false);
        setOpenCreate(false);
      }
      if (!res.ok) {
        setOpenCreateConfirm(false);
        throw new Error(res.message || 'Error al crear el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const obj = await getObjsUser(1);
      if (obj.ok) {
        setRow(Array.isArray(obj?.datos?.data) ? obj.datos?.data : []);
        console.log(obj);
      }
      if (!obj.ok) {
        toast.error(obj.message || 'Error al cargar lo datos');
      }
    } catch (e) {
      toast.error(e.message || 'Error al cargar lo datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return row;
    return row.filter((r) => {
      // Busca en columnas simples
      const matchSimple = ['fecha'].some((k) => normalize(r?.[k]).includes(q));

      return matchSimple;
    });
  }, [row, query]);

  // slice de paginado en cliente
  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  useEffect(() => {
    setPage(0);
  }, [query, rowsPerPage]);

  const pagesToShow = useMemo(() => {
    const total = totalPages;
    const current = page; // 0-based
    const windowSize = 5; // cantidad de botones visibles

    if (total <= windowSize) return Array.from({ length: total }, (_, i) => i);

    const half = Math.floor(windowSize / 2);
    let start = Math.max(0, current - half);
    let end = Math.min(total - 1, start + windowSize - 1);

    // Ajuste si estamos al final
    start = Math.max(0, end - (windowSize - 1));

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  };
  return (
    <>
      <>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text">
            Produccion / Administracion / Atencion consulta medica
          </h2>
          <button
            className="rounded-xl bg-emerald-800 px-10 py-2 text-white hover:bg-emerald-900"
            onClick={handleCreate}
          >
            Registrar dia
          </button>
        </div>
        <div className="rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            {/* Buscador */}
            <div className="w-full md:max-w-sm">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar
              </label>

              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900
                   focus:border-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-200"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Select */}
            <div className="w-full md:w-90">
              <Select
                label="Períodos"
                value={turnoId}
                onChange={setTurnoId}
                placeholder="Selecciona un período"
                getDatos={getPeriodos}
              />
            </div>
          </div>
        </div>
        <div className=" mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="max-h-[70vh] overflow-auto rounded-2xl">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead className="sticky top-0 z-20 bg-slate-50">
                <tr className="divide-x divide-slate-200">
                  <th
                    className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 text-center  [writing-mode:vertical-rl]  rotate-180"
                    rowSpan={2}
                  >
                    DIA
                  </th>
                  <th
                    className="border-b border-slate-200 px-2 py-4 font-semibold text-slate-700"
                    colSpan={15}
                  >
                    PRESENTACIONES MEDICAS
                  </th>
                  <th
                    className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 text-center  [writing-mode:vertical-rl]  rotate-180"
                    rowSpan={2}
                  >
                    TOTAL CONSULTAS
                  </th>
                  <th
                    className="border border-slate-200 px-1 py-1 font-semibold text-slate-700 text-center  [writing-mode:vertical-rl]  rotate-180"
                    rowSpan={2}
                  >
                    CONTROL P.A.
                  </th>
                  <th
                    className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 text-center  [writing-mode:vertical-rl]  rotate-180"
                    rowSpan={2}
                  >
                    GLICEMIA CAPILAR
                  </th>
                  <th
                    className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 text-center  [writing-mode:vertical-rl]  rotate-180"
                    rowSpan={2}
                  >
                    RIESGO PROF.
                  </th>
                  <th
                    className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 text-center  [writing-mode:vertical-rl]  rotate-180"
                    rowSpan={2}
                  >
                    RIESGO COMUN
                  </th>
                  <th
                    className="border border-slate-200  font-semibold text-slate-700 text-center "
                    rowSpan={2}
                  >
                    ACCIONES
                  </th>
                </tr>

                <tr className="divide-x divide-slate-200">
                  <th className="border  border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    ALRGIAS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    CARDIOVASCULAR
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    CEFALEAS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    OFTAMOLOGICAS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    DISGESTIVAS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    GENITOURINARIAS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    MUSCULO ESQUELETICAS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    ODONTALGIA
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    QUEMADURAS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    PIEL Y ANEXOS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    OTROS
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    CURACIONES
                  </th>
                  <th className="border border-slate-200 px-2 py-1 font-semibold text-slate-700 [writing-mode:vertical-rl]  rotate-180">
                    INYECTABLES
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={19}
                      className="px-4 py-10 text-center text-sm text-slate-600"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                        Cargando datos...
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={19}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No hay registros
                    </td>
                  </tr>
                ) : (
                  paginated.map((data, index) => (
                    <tr
                      key={data.id ?? `${data.fecha}-${index}`}
                      className="divide-x divide-slate-200 transition-colors odd:bg-white even:bg-slate-50 hover:bg-slate-100"
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-slate-700 whitespace-nowrap">
                        {data.fecha}
                      </td>

                      <td className=" left-28 z-10 bg-inherit px-4 py-3 text-slate-900 whitespace-normal">
                        {data.prestacion_medica_alergias}
                      </td>

                      <td className="px-4 py-3 text-slate-900 whitespace-normal">
                        {data.prestacion_medica_cardiovasculares}
                      </td>
                      <td className="px-4 py-3 text-slate-900 whitespace-normal">
                        {data.prestacion_medica_cefaleas}
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums text-slate-900">
                        {data.prestacion_medica_oftamologicas}
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_oticas}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_respiratorias}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_digestivas}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_genitourinarias}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_musculo_esqueleticas}
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_odontologia}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_quemaduras}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_piel_anexos}
                      </td>

                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.standard ?? 0}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_otros}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {data?.prestacion_medica_curaciones}
                      </td>

                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                        {data?.prestacion_medica_inyectables}
                      </td>
                      <td className="px-4 py-3 text-slate-700 whitespace-normal">
                        {'12'}
                      </td>
                      <td className="px-4 py-3 text-slate-700 whitespace-normal">
                        {data?.control_pa}
                      </td>
                      <td className="px-4 py-3 text-slate-700 whitespace-normal">
                        {data?.glicemia_capilar}
                      </td>
                      <td className="px-4 py-3 text-slate-700 whitespace-normal">
                        {data?.riesgo_prof}
                      </td>
                      <td className="px-4 py-3 text-slate-700 whitespace-normal">
                        {data?.riesto_comun}
                      </td>
                      <td className="px-4 py-3 sticky right-0 z-10 bg-white">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
                            onClick={() => {}}
                          >
                            Editar
                          </button>
                          <button
                            className="rounded-xl bg-red-700 px-3 py-2 text-white hover:bg-red-900"
                            onClick={() => {}}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Filas por página */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Filas:</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <span className="ml-2">
              {filtered.length === 0
                ? '0'
                : `${page * rowsPerPage + 1}-${Math.min(
                    (page + 1) * rowsPerPage,
                    filtered.length,
                  )}`}{' '}
              de {filtered.length}
            </span>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Anterior
            </button>

            {/* Primera página + ... */}
            {pagesToShow[0] > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setPage(0)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  1
                </button>
                <span className="px-1 text-slate-400">…</span>
              </>
            )}

            {/* Páginas visibles */}
            {pagesToShow.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={[
                  'rounded-xl px-3 py-1.5 text-sm border',
                  p === page
                    ? 'border-green-900 bg-green-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
                ].join(' ')}
              >
                {p + 1}
              </button>
            ))}

            {/* ... + última página */}
            {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && (
              <>
                <span className="px-1 text-slate-400">…</span>
                <button
                  type="button"
                  onClick={() => setPage(totalPages - 1)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              Siguiente
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </>
      <AtencionConsultorioMedicoModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreateComfirm}
      />
      <ConfirmModal
        open={openCreateConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenCreateConfirm(false)}
        onConfirm={handleSaveCreate}
      />
    </>
  );
}
