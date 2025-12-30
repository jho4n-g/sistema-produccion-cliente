import { useEffect, useRef, useState } from 'react';
import { getDocumentsViewProcedimiento } from '../../../service/Documentos/Procedimientos';

export default function PdfPreviewTW({ novedadId }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const previousUrlRef = useRef(null);

  useEffect(() => {
    if (!novedadId) return;

    let active = true;

    const fetchPdf = async () => {
      setLoading(true);

      try {
        const res = await getDocumentsViewProcedimiento(novedadId); // ✅ await

        if (!active) return;

        if (!res?.ok || !res?.blob) {
          throw new Error(res?.message || 'No se pudo cargar el PDF');
        }

        // revoca URL anterior
        if (previousUrlRef.current) {
          URL.revokeObjectURL(previousUrlRef.current);
          previousUrlRef.current = null;
        }

        const blobUrl = URL.createObjectURL(res.blob); // ✅ res.blob
        previousUrlRef.current = blobUrl;
        setPreviewUrl(blobUrl);
      } catch (err) {
        console.error('Error cargando PDF', err);

        if (previousUrlRef.current) {
          URL.revokeObjectURL(previousUrlRef.current);
          previousUrlRef.current = null;
        }

        if (active) setPreviewUrl(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      active = false;
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
        previousUrlRef.current = null;
      }
      setPreviewUrl(null);
    };
  }, [novedadId]);

  if (!novedadId) return null;

  return (
    <div className="mt-4 min-h-65 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">
          Vista previa del documento
        </h4>

        {loading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-700" />
            Cargando…
          </div>
        )}
      </div>

      <div className="h-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            title={`procedimiento-${novedadId}`}
            className="h-full w-full border-0"
            key={previewUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <p className="text-sm text-slate-600">
              {loading ? 'Cargando PDF…' : 'No se pudo cargar el PDF.'}
            </p>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-3 flex justify-end gap-2">
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-emerald-700 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            Abrir en pestaña
          </a>
        </div>
      )}
    </div>
  );
}
