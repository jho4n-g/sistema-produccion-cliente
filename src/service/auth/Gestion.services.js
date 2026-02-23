import { api } from '../api';
import { toServiceError } from '../error';

export const createObj = async (payload) => {
  try {
    const data = await api.post(`/gestion/`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getObjs = async () => {
  try {
    const data = await api.get('/gestion');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getPeriodos = async () => {
  try {
    const data = await api.get('/gestion/periodo');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/gestion/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/gestion/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/gestion/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
