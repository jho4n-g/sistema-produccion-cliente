import { api } from '../api';
import { toServiceError } from '../error';

export const getObjs = async () => {
  try {
    const data = await api.get('/medicina/inventario');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/medicina/inventario/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`medicina/inventario/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const NextPeriodoObj = async (id, payload) => {
  try {
    const data = await api.put(`medicina/inventario/${id}/siguiente`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const registerObj = async (payload) => {
  try {
    const data = await api.post('/medicina/inventario', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/medicina/inventario/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIncrementarObjs = async (id) => {
  try {
    const data = await api.get(`/medicina/inventario/${id}/sumar`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getDecrementarObjs = async (id) => {
  try {
    const data = await api.get(`/medicina/inventario/${id}/restar`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
