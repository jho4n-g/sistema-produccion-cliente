import { api } from '../api';

export const getDocuments = async () => {
  try {
    const data = await api.get('/secretaria/correspondencia');
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

export const getIdDocument = async (id) => {
  try {
    const data = await api.get(`/secretaria/correspondencia/${id}`);
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

export const getDocumentsView = async (id) => {
  try {
    const res = await api.get(`/secretaria/correspondencia/view/${id}`, {
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

export const getDocumentsDownload = (id) => {
  return `${import.meta.env.VITE_API_URL}/secretaria/correspondencia/download/${id}`;
};

export const createDocuments = async (payload) => {
  try {
    const fd = new FormData();

    // Formatear fechas correctamente

    fd.append('fecha', payload.fecha);
    fd.append('cite', payload.cite);
    fd.append('referencia', payload.referencia);
    fd.append('emitido_por', payload.emitido_por);

    fd.append('file', payload.file);

    const res = await api.post(`/secretaria/correspondencia`, fd);
    return res.data;
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

export const updatedDocument = async (id, payload) => {
  try {
    const fd = new FormData();
    fd.append('fecha', payload.fecha);
    fd.append('cite', payload.cite);
    fd.append('emitido_por', payload.emitido_por);

    fd.append('file', payload.file);

    const res = await api.put(`/secretaria/correspondencia/${id}`, fd);
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
    const res = await api.delete(`/secretaria/correspondencia/${id}`);
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
