import { api } from '../api';
import { toServiceError } from '../error';

export const getAllObj = async () => {
  try {
    const data = await api.get('/administracion/consultorio-dental');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/administracion/consultorio-dental/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/consultorio-dental/${id}`,
      payload
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/administracion/consultorio-dental', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/consultorio-dental/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
