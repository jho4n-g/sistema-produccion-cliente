import { api } from '../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/comercializacion/ingreso-ventas-total');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/comercializacion/ingreso-ventas-total/${id}`);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/comercializacion/ingreso-ventas-total/${id}`,
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
    const data = await api.post(
      '/comercializacion/ingreso-ventas-total',
      payload
    );
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(
      `/comercializacion/ingreso-ventas-total/${id}`
    );
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
