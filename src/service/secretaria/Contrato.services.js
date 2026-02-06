import { api } from '../api';

export const getDocuments = async () => {
  try {
    const data = await api.get('/secretaria/contrato');
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
    const data = await api.get(`/secretaria/contrato/${id}`);
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
    const res = await api.get(`/secretaria/contrato/view/${id}`, {
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
  return `${import.meta.env.VITE_API_URL}/secretaria/contrato/download/${id}`;
};

export const createDocuments = async (payload) => {
  try {
    console.log(payload);
    const fd = new FormData();

    // Formatear fechas correctamente

    fd.append('n_contrato_cite', payload.n_contrato_cite);
    fd.append('area_contrato', payload.area_contrato);
    fd.append('empresa', payload.empresa);
    fd.append('proveedor', payload.proveedor);
    fd.append('objeto', payload.objeto);
    fd.append('monto_contrato', payload.monto_contrato);
    fd.append('fecha_inicio', payload.fecha_inicio);
    fd.append('finalizacion_contrato', payload.finalizacion_contrato);

    fd.append('file', payload.file);

    const res = await api.post(`/secretaria/contrato`, fd);
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

    fd.append('n_contrato_cite', payload.n_contrato_cite);
    fd.append('area_contrato', payload.area_contrato);
    fd.append('empresa', payload.empresa);
    fd.append('proveedor', payload.proveedor);
    fd.append('objeto', payload.objeto);
    fd.append('monto_contrato', payload.monto_contrato);
    fd.append('fecha_inicio', payload.fecha_inicio);
    fd.append('finalizacion_contrato', payload.finalizacion_contrato);

    fd.append('file', payload.file);

    const res = await api.put(`/secretaria/contrato/${id}`, fd);
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

export const delelteDocument = async (id) => {
  try {
    const res = await api.delete(`/secretaria/contrato/${id}`);
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
