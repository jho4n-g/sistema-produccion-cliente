import { api } from '../api';

export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/administracion/donaciones/promedios`);
    return data.data;
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
export const getObjsDesempenioMes = async (id) => {
  try {
    const data = await api.get(`/administracion/donaciones/desempenio/${id}`);
    return data.data;
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
export const getObjsUser = async (id) => {
  try {
    const data = await api.get(`/administracion/donaciones/cliente/${id}`);
    return data.data;
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
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/administracion/donaciones/${id}`);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/administracion/donaciones/${id}`, payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/administracion/donaciones', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/donaciones/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
