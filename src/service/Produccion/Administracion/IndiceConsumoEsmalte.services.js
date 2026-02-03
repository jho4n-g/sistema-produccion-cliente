import { api } from '../../api';

export const getObjPromedios = async () => {
  try {
    const data = await api.get(`/produccion/indice-consumo-esmalte/promedios`);
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
    const data = await api.get(
      `/produccion/indice-consumo-esmalte/desempenio/${id}`,
    );
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
export const registerObjMetas = async (payload) => {
  try {
    const data = await api.post(
      `/produccion/indice-consumo-esmalte/metas`,
      payload,
    );
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
    const data = await api.get(
      `/produccion/indice-consumo-esmalte/cliente/${id}`,
    );
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
    const data = await api.get(`/produccion/indice-consumo-esmalte/${id}`);
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
export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/produccion/indice-consumo-esmalte/${id}`,
      payload,
    );
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};
export const registerObj = async (payload) => {
  try {
    const data = await api.post('/produccion/indice-consumo-esmalte/', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};
export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/indice-consumo-esmalte/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
