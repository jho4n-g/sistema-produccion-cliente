import { api } from '../api';

export const getObjs = async () => {
  try {
    const data = await api.get('/produccion/turno');
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
export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/turno', payload);
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

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/produccion/turno/${id}`);
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

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/produccion/turno/${id}`, updateddata);
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

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/turno/${id}`);
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
