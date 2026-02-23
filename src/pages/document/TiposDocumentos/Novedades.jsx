import { toast } from 'react-toastify';
import DocumentCard from '../../../components/Cards/DocumentCard';
import PaginationBar from '../../../components/Cards/PaginationBar';
import React, { useEffect, useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const normalizeText = (value) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const toTimestamp = (value) => {
  const timestamp = Date.parse(value ?? '');
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export default function Novedades({
  ObtenerDocumentos,
  searchQuery,
  area,
  sortBy = 'recientes',
  onFilteredCountChange,
  onLoadingChange,
}) {
  const [datosDocumentos, setDatosDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageDocumentos, setPageDocumentos] = useState(1);
  const rowsDocPage = 8;

  useEffect(() => {
    let active = true; // evita setState tras unmount
    setLoading(true);

    (async () => {
      try {
        const data = await ObtenerDocumentos();

        if (!active) return;

        if (data?.ok) {
          setDatosDocumentos(data?.datos?.data ?? []);
        }
        if (!data?.ok) {
          const err = new Error(
            data.message || 'Error al obtener los documentos',
          );
          throw err;
        }
      } catch (e) {
        if (active) {
          toast.error(e?.message || 'Error del servidor');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [ObtenerDocumentos]);

  const filteredDocumentos = useMemo(() => {
    const query = normalizeText(searchQuery);
    const selectedArea = normalizeText(area);
    const applyAreaFilter = selectedArea && selectedArea !== 'todas';

    return datosDocumentos.filter((p) => {
      const hayTexto = normalizeText(
        [p.titulo, p.fecha, p.codigo, p.descripcion].join(' '),
      ).includes(query);
      const areaDoc = normalizeText(p.area);
      const areaCoincide =
        applyAreaFilter && areaDoc ? areaDoc === selectedArea : true;

      return hayTexto && areaCoincide;
    });
  }, [datosDocumentos, searchQuery, area]);

  const totalPagesDocumentos = Math.max(
    1,
    Math.ceil(filteredDocumentos.length / rowsDocPage),
  );

  useEffect(() => {
    setPageDocumentos(1);
  }, [searchQuery, area, sortBy]);

  useEffect(() => {
    if (pageDocumentos > totalPagesDocumentos) {
      setPageDocumentos(totalPagesDocumentos);
    }
  }, [pageDocumentos, totalPagesDocumentos]);

  const sortedDocumentos = useMemo(() => {
    if (sortBy === 'original') {
      return filteredDocumentos;
    }

    const docs = [...filteredDocumentos];

    switch (sortBy) {
      case 'antiguos':
        return docs.sort((a, b) => toTimestamp(a.fecha) - toTimestamp(b.fecha));
      case 'titulo':
        return docs.sort((a, b) =>
          normalizeText(a.titulo).localeCompare(normalizeText(b.titulo), 'es'),
        );
      case 'codigo':
        return docs.sort((a, b) =>
          normalizeText(a.codigo).localeCompare(normalizeText(b.codigo), 'es'),
        );
      case 'recientes':
      default:
        return docs.sort((a, b) => toTimestamp(b.fecha) - toTimestamp(a.fecha));
    }
  }, [filteredDocumentos, sortBy]);

  useEffect(() => {
    onFilteredCountChange?.(sortedDocumentos.length);
  }, [sortedDocumentos.length, onFilteredCountChange]);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  const paginatedDocs = useMemo(() => {
    const start = (pageDocumentos - 1) * rowsDocPage;
    return sortedDocumentos.slice(start, start + rowsDocPage);
  }, [pageDocumentos, rowsDocPage, sortedDocumentos]);

  const handleChangePage = (_evt, value) => {
    setPageDocumentos(value);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-green-700" />
                <p className="text-sm font-semibold text-slate-700">
                  Cargando datos…
                </p>
              </div>
            </div>
          </div>
        ) : (filteredDocumentos?.length ?? 0) > 0 ? (
          <>
            {paginatedDocs.map((r) => (
              <DocumentCard
                key={r.id}
                id={r.id}
                area={r.area}
                codigo={r.codigo}
                descripcion={r.descripcion}
                fecha={r.fecha}
                revision={r.revision}
                tipo={r.tipo}
                titulo={r.titulo}
              />
            ))}

            <div className="col-span-full">
              <PaginationBar
                filteredLength={filteredDocumentos.length}
                page={pageDocumentos}
                pageSize={rowsDocPage}
                totalPages={totalPagesDocumentos}
                onPageChange={(newPage) => handleChangePage(null, newPage)}
              />
            </div>
          </>
        ) : (
          <div className="col-span-full">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
              <MagnifyingGlassIcon className="h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                No se encontraron resultados
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Prueba cambiando los filtros o el término de búsqueda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
