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
export const getDocumentsNovedades = async () => {
  try {
    const data = await api.get('/documento/novedad');
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

export const getIdDocumentNovedad = async (id) => {
  try {
    const data = await api.get(`/documento/novedad/${id}`);
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

export const getDocumentsViewNovedad = async (id) => {
  try {
    const res = await api.get(`/documento/novedad/view/${id}`, {
      responseType: 'blob',
    });
    return { ok: true, blob: res.data };
  } catch (e) {
    console.log(e);
    if (e.code == 'ERR_NETWORK') {
      return {
        ok: false,
        message: 'Error en el servidor',
      };
    }
    return e.response.data;
  }
};

export const getDocumentsDownloadNovedad = (id) => {
  return `${import.meta.env.VITE_API_URL}/documento/novedad/download/${id}`;
};

export const createDocuments = async (payload) => {
  try {
    const fd = new FormData();

    // Formatear fechas correctamente

    fd.append('titulo', payload.titulo);
    fd.append('fecha', formatDate(payload.fecha));
    fd.append('gestion', payload.gestion);
    fd.append('descripcion', payload.descripcion);

    fd.append('file', payload.file);

    const res = await api.post(`/documento/novedad`, fd);
    return res.data;
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

export const updatedDocument = async (id, payload) => {
  try {
    const fd = new FormData();
    fd.append('titulo', payload.titulo);
    fd.append('fecha', formatDate(payload.fecha));
    fd.append('gestion', payload.gestion);
    fd.append('descripcion', payload.descripcion);

    fd.append('file', payload.file);

    const res = await api.put(`/documento/novedad/${id}`, fd);
    return res.data;
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

export const delelteDocument = async (id) => {
  try {
    const res = await api.delete(`/documento/novedad/${id}`);
    return res.data;
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
