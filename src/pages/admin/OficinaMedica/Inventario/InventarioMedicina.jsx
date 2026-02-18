import TablaRetutilizable from '@components/TablaReutilizable';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { normalize } from '@/helpers/normalze.helpers';
import {
  deleteObj,
  getObjs,
  updateObj,
  getIdObj,
  registerObj,
  getIncrementarObjs,
  getDecrementarObjs,
  NextPeriodoObj,
} from '@service/OficinaMedica/InventarioMedicina.services.js';
import ConfirmModal from '@components/ConfirmModal';
import InventarioMedicinaModa from './InventarioMedicinaModa';
import { useState, useCallback, useEffect, useMemo } from 'react';
import InventarioMedicinaDetallesModal from './InventarioMedicinaDetallesModal';
import ActualizarInventarioModal from './ActualizarInventarioModal';
import ExcelExportButton from '@components/ExcelExportButton';
import MedicamentosPdfButton from '@components/MedicamentosPdfButton';

const columnas = [
  {
    label: 'Codigo',
    key: 'codigo',
  },
  {
    label: 'Descripcion',
    key: 'descripcion',
  },
  { label: 'Cotcion', key: 'cotcion' },
  {
    label: 'Unidad',
    key: 'unidad',
  },
  {
    label: 'Salida',
    key: 'salida',
  },
  {
    label: 'Saldo actual',
    key: 'saldo_actual',
  },
  {
    label: 'Saldo anterior',
    key: 'saldo_anterior',
  },
];

export default function Donaciones() {
  const [query, setQuery] = useState('');

  const [row, setRow] = useState([]);
  const [idRow, setIdRow] = useState(null);
  const [openModalDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payload, setPayload] = useState(null);
  //crear
  const [openCreate, setOpenCreate] = useState(false);
  const [openCreateConfirm, setOpenCreateConfirm] = useState(false);
  const [payloadCreate, setPayloadCreate] = useState({});
  //
  // paginado (cliente)
  const [page, setPage] = useState(0); // 0-based
  const [rowsPerPage, setRowsPerPage] = useState(5);
  //
  //detalles
  const [openDetails, setOpenDetails] = useState(false);
  const [detailId, setDetailId] = useState(null);
  //Acutualizar Inventario
  const [idSaldo, setIdSaldo] = useState(null);
  const [openSaldo, setOpenSaldo] = useState(false);
  const [openSaldoConfirm, setOpenSaldoConfirm] = useState(false);
  const [payloadSaldo, setPayloadSaldo] = useState(null);

  //actualiar
  const handleSaldo = (id) => {
    setIdSaldo(id);
    setOpenSaldo(true);
  };

  const handleSaldoConfirm = (payload) => {
    setPayloadSaldo(payload);
    setOpenSaldoConfirm(true);
  };

  const handleSaveSaldo = async () => {
    try {
      const res = await NextPeriodoObj(idSaldo, payloadSaldo);
      if (res.ok) {
        toast.success('Registro eliminado con éxito');
        setOpenSaldoConfirm(false);
        setOpenSaldo(false);
        reload();
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al eliminar el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar saldo');
    }
  };

  //Detalles
  const handleView = (id) => {
    setDetailId(id);
    setOpenDetails(true);
  };

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const obj = await getObjs();
      console.log('reload ->', obj);

      if (!obj?.ok) {
        throw new Error(obj?.message || 'Error al cargar los datos');
      }
      // ✅ lista
      const data = obj?.datos?.data;
      setRow(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.message || 'Error al cargar los datos', {
        toastId: 'tabla-reload-error',
      });
    } finally {
      setLoading(false);
    }
  }, []);
  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return row;
    return row.filter((r) => {
      // Busca en columnas simples
      const matchSimple = ['codigo', 'unidad', 'descripcion'].some((k) =>
        normalize(r?.[k]).includes(q),
      );
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
  useEffect(() => {
    reload();
  }, [reload]);

  //

  const hanldeOpenConfirmDelete = (id) => {
    setIdRow(id);
    setOpenDelete(true);
  };
  const hanldeDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteObj(idRow);
      if (res.ok) {
        toast.success('Registro eliminado con éxito');
        closeDelete();
        setOpenDetails(false);
        reload();
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al eliminar el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Problemos en el servidor');
    } finally {
      setLoading(false);
    }
  };
  const closeDelete = () => {
    setOpenDelete(false);
    setIdRow(null);
  };

  const hanldeEdit = (id) => {
    setIdRow(id);
    setOpenModal(true);
    setOpenDetails(false);
  };

  const handleOpenConfirmUpdate = (data) => {
    setPayload(data);
    setOpenModalUpdate(true);
  };
  const handleCloseConfirmUpdate = () => {
    setIdRow(null);
    setPayload(null);
    setOpenModalUpdate(false);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await updateObj(idRow, payload);
      if (res.ok) {
        toast.success('Registro actualizado con éxito');
        setOpenModalUpdate(false);
        reload();
        setOpenModal(false);
      }
      if (!res.ok) {
        toast.error(res.message || 'Error al actualizar el registro12');
        setOpenModalUpdate(false);
      }
    } catch (e) {
      toast.error(e.message || 'Error al actualizar el registro');
    } finally {
      setLoading(false);
    }
  };
  //create
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleOpenConfirmCreate = (data) => {
    setPayloadCreate(data);
    setOpenCreateConfirm(true);
  };

  const handleCreate = async () => {
    try {
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
      toast.error(e.message || 'Error al crear el registro');
    } finally {
      setLoading(false);
    }
  };
  const handleIncrementarSalida = async (id) => {
    try {
      const res = await getIncrementarObjs(id);
      if (res.ok) {
        toast.success(res.message || 'Se incremento con éxito la salida');
        reload();
      }
      if (!res.ok) {
        throw new Error(res.message || 'Error al incrementar salida');
      }
    } catch (e) {
      toast.error(e.message || 'Error al incrementar salida');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrementarSalida = async (id) => {
    try {
      const res = await getDecrementarObjs(id);
      if (res.ok) {
        toast.success(res.message || 'Se decremento con éxito la salida');
        reload();
      }
      if (!res.ok) {
        throw new Error(res.message || 'Error al decremento salida');
      }
    } catch (e) {
      toast.error(e.message || 'Error al v salida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <>
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text">
              CONSULTORIO MEDICO/ INVENTARIO
            </h2>
            <button
              className="rounded-xl bg-emerald-800 px-10 py-2 text-white hover:bg-emerald-900"
              onClick={handleOpenCreate}
            >
              Registrar medicina
            </button>
          </div>
          <div className="rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
              <div className="flex gap-2">
                <ExcelExportButton
                  columns={columnas}
                  data={row}
                  fileName="inventario.xlsx"
                  sheetName="Inventario"
                  className="rounded-xl bg-emerald-800 px-10 py-2 text-white hover:bg-emerald-900"
                >
                  Exportar Excel
                </ExcelExportButton>
                <MedicamentosPdfButton
                  columnas={columnas}
                  className="rounded-xl bg-emerald-800 px-10 py-2 text-white hover:bg-emerald-900"
                  rows={row}
                  meta={{
                    caja: 'CAJA DE SALUD "CORDES"',
                    regional: 'Regional-Cochabamba',
                    titulo1: 'MEDICAMENTOS',
                    titulo2: 'PUESTO MÉDICO COBOCE',
                    lugar: 'Cochabamba',
                    fecha: '30-sep',
                    nro: '1',
                    gestion: '25',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4  rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="w-full overflow-x-auto">
              <table className="min-w-max w-full table-auto border-separate border-spacing-0 text-sm">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr className="divide-x divide-slate-200">
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      codigo
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Descripcion
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Contcion
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Unidad
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Salida
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Saldo actual
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Saldo anterior
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={columnas.length + 1}
                        className="px-4 py-8 text-center text-sm text-slate-600"
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
                        colSpan={columnas.length + 1}
                        className="px-4 py-8 text-center text-sm text-slate-500"
                      >
                        No hay registros
                      </td>
                    </tr>
                  ) : (
                    paginated.map((data, ri) => (
                      <tr
                        key={
                          data.id ??
                          data.periodo_id ??
                          `${data.periodo}-${data.numero}-${ri}`
                        }
                        className="border border-slate-300  divide-x divide-slate-200 hover:bg-slate-100/60 transition-colors"
                      >
                        {columnas.map((c, i) => (
                          <td
                            key={`${c.key}-${i}`}
                            className={[
                              'px-4 py-3  whitespace-nowrap',
                              i === 0 && 'sticky left-0 z-10 bg-white',
                            ].join(' ')}
                          >
                            {c.render ? c.render(data) : data[c.key]}
                          </td>
                        ))}

                        <td className="px-4 py-3 sticky right-0 z-10 bg-white max-w-60">
                          <div className="flex flex-col gap-2 items-center">
                            <div className="flex gap-2">
                              <button
                                className="rounded-xl bg-white px-3 py-2 text-green-900 ring-1 ring-green-900 hover:bg-emerald-100 w-full"
                                onClick={() => handleView(data.id)}
                              >
                                Detalles
                              </button>
                              <button
                                className="inline-flex items-center gap-2 rounded-xl bg-white ring-1  ring-green-900 px-3 py-2 text-green-900 hover:bg-emerald-100  whitespace-nowrap"
                                onClick={() => handleSaldo(data.id)}
                              >
                                Aumentar s. actual
                              </button>
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="inline-flex items-center gap-2 rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900 whitespace-nowrap"
                                onClick={() => {
                                  handleIncrementarSalida(data.id);
                                }}
                              >
                                <PlusIcon className="h-5 w-5" />
                                Agregar salida
                              </button>

                              <button
                                className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-3 py-2 text-white hover:bg-red-900 whitespace-nowrap"
                                onClick={() => {
                                  handleDecrementarSalida(data.id);
                                }}
                              >
                                <MinusIcon className="h-5 w-5" />
                                Quitar salida
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
                >
                  Siguiente
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>

      <InventarioMedicinaModa
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleOpenConfirmUpdate}
        fetchById={getIdObj}
        id={idRow}
        isEdit={true}
      />
      <ConfirmModal
        open={openModalUpdate}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={handleCloseConfirmUpdate}
        onConfirm={handleSave}
      />
      <InventarioMedicinaModa
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleOpenConfirmCreate}
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
        onConfirm={handleCreate}
      />
      <InventarioMedicinaDetallesModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fetchById={getIdObj}
        id={detailId}
        onEdit={hanldeEdit}
        onDelete={hanldeOpenConfirmDelete}
      />
      <ConfirmModal
        open={openModalDelete}
        title="Eliminar registro"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={loading}
        danger
        onClose={closeDelete}
        onConfirm={hanldeDelete}
      />
      <ActualizarInventarioModal
        open={openSaldo}
        onClose={() => setOpenSaldo(false)}
        onSave={handleSaldoConfirm}
        fetchById={getIdObj}
        id={idSaldo}
        isEdit={true}
      />
      <ConfirmModal
        open={openSaldoConfirm}
        title="Guardar registro"
        message="¿Deseas continuar?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        loading={loading}
        danger={false}
        onClose={() => setOpenSaldoConfirm(false)}
        onConfirm={handleSaveSaldo}
      />
    </>
  );
}
