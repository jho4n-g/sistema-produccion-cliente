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
export const getDocumentsProcedimiento = async () => {
  try {
    const data = await api.get('/documento/procedimiento');
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

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/documento/procedimiento/${id}`);
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

export const getDocumentsViewProcedimiento = async (id) => {
  try {
    const res = await api.get(`/documento/procedimiento/view/${id}`, {
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
export const getDocumentsDownloadProcedimiento = (id) => {
  return `${
    import.meta.env.VITE_API_URL
  }/documento/procedimiento/download/${id}`;
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
    fd.append('area', payload.area);

    fd.append('file', payload.file);

    const res = await api.post(`/documento/procedimiento`, fd);
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
  console.log('payload', payload);
  try {
    const fd = new FormData();
    fd.append('titulo', payload.titulo);
    fd.append('fecha', formatDate(payload.fecha));
    fd.append('fecha_aprobado', formatDate(payload.fecha_aprobado));
    fd.append('codigo', payload.codigo);
    fd.append('revision', payload.revision);
    fd.append('descripcion', payload.descripcion);
    fd.append('area', payload.area);

    fd.append('file', payload.file);

    const res = await api.put(`/documento/procedimiento/${id}`, fd);
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
    const res = await api.delete(`/documento/procedimiento/${id}`);
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
