import { api } from '../../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/produccion/reclamos-produccion/');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/produccion/reclamos-produccion/${id}`,
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
    const data = await api.post('/produccion/reclamos-produccion/', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/reclamos-produccion/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
