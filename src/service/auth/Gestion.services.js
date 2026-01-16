import { api } from '../api';

export const createObj = async (payload) => {
  try {
    const data = await api.post(`/gestion/`, payload);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getObjs = async () => {
  try {
    const data = await api.get('/gestion');
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/gestion/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/gestion/${id}`, payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};
export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/gestion/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
