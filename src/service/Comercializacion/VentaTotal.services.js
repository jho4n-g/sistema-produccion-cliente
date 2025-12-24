import { api } from '../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/comercializacion/venta-total');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/comercializacion/venta-total/${id}`, payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/comercializacion/venta-total', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/comercializacion/venta-total/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
