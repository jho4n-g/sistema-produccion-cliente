import { api } from '../../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/produccion/indice-polvo-atomizado/');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/produccion/indice-polvo-atomizado/${id}`);
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
      `/produccion/indice-polvo-atomizado/${id}`,
      payload
    );
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/produccion/indice-polvo-atomizado/', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/indice-polvo-atomizado/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
