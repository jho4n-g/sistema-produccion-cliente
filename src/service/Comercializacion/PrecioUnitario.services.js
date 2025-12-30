import { api } from '../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/comercializacion/precio-unitario');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/comercializacion/precio-unitario/${id}`);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/comercializacion/precio-unitario/${id}`,
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
    const data = await api.post('/comercializacion/precio-unitario', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/comercializacion/precio-unitario/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
