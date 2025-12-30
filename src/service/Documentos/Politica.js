import { api } from '../api';

const formatDate = (date) => {
  if (!date) return null;

  // Si es un objeto Date
  if (date instanceof Date && !isNaN(date)) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // Si es string, intentar parsear
  if (typeof date === 'string') {
    const parsed = new Date(date);
    if (!isNaN(parsed)) {
      return parsed.toISOString().split('T')[0]; // YYYY-MM-DD
    }
  }

  return null;
};

export const getDocumentsPolitica = async () => {
  try {
    const data = await api.get('/documento/politica');
    return data.data;
  } catch (e) {
    if (e.code == 'ERR_NETWORK') {
      return {
        ok: false,
        message: 'Error en el servidor',
      };
    }
    return e.response.data;
  }
};

export const getIdDocumentPolitica = async (id) => {
  try {
    const data = await api.get(`/documento/politica/${id}`);
    return data.data;
  } catch (e) {
    if (e.code == 'ERR_NETWORK') {
      return {
        ok: false,
        message: 'Error en el servidor',
      };
    }
    return e.response.data;
  }
};

export const getDocumentsViewPolitica = async (id) => {
  try {
    const res = await api.get(`/documento/politica/view/${id}`, {
      responseType: 'blob',
    });
    return { ok: true, blob: res.data };
  } catch (e) {
    if (e.code == 'ERR_NETWORK') {
      return {
        ok: false,
        message: 'Error en el servidor',
      };
    }
    return e.response.data;
  }
};
export const getDocumentsDownloadPolitica = (id) => {
  return `${import.meta.env.VITE_API_URL}/documento/politica/download/${id}`;
};

export const createDocuments = async (payload) => {
  try {
    const fd = new FormData();

    // Formatear fechas correctamente

    fd.append('titulo', payload.titulo);
    fd.append('fecha', formatDate(payload.fecha));
    fd.append('fecha_aprobado', formatDate(payload.fecha_aprobado));
    fd.append('codigo', payload.codigo);
    fd.append('revision', payload.revision);
    fd.append('descripcion', payload.descripcion);
    fd.append('file', payload.file);

    const res = await api.post(`/documento/politica`, fd);
    return res.data;
  } catch (err) {
    return err.response?.data || err.message;
  }
};

export const updatedDocument = async (id, payload) => {
  try {
    const fd = new FormData();
    fd.append('titulo', payload.titulo);
    fd.append('fecha', formatDate(payload.fecha));
    fd.append('fecha_aprobado', formatDate(payload.fecha_aprobado));
    fd.append('codigo', payload.codigo);
    fd.append('revision', payload.revision);
    fd.append('descripcion', payload.descripcion);

    fd.append('file', payload.file);

    const res = await api.put(`/documento/politica/${id}`, fd);
    return res.data;
  } catch (err) {
    return err.response?.data || err.message;
  }
};

export const delelteDocument = async (id) => {
  try {
    const res = await api.delete(`/documento/politica/${id}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};
