import { api } from '../../api.js';

export const registerObj = async (payload) => {
  try {
    const response = await api.post('/produccion/seleccion-embalaje', payload);
    return response.data;
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

export const getObjs = async () => {
  try {
    const data = await api.get('/produccion/seleccion-embalaje');
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
    const res = await api.get(`/produccion/seleccion-embalaje/${id}`);
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
    const data = await api.put(
      `/produccion/seleccion-embalaje/${id}`,
      updateddata
    );
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
    const data = await api.delete(`/produccion/seleccion-embalaje/${id}`);
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
