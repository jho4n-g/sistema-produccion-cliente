import { api } from '../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/administracion/evolucion-contado');
    console.log('evolucion');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/evolucion-contado/${id}`,
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
    const data = await api.post('/administracion/evolucion-contado', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/evolucion-contado/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
