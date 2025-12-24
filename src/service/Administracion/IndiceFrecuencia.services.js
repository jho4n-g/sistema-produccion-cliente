import { api } from '../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/administracion/indice-frecuencia');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/indice-frecuencia/${id}`,
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
    const data = await api.post('/administracion/indice-frecuencia', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/indice-frecuencia/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
