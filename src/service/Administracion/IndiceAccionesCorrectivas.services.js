import { api } from '../api';
import { toServiceError } from '../error';

export const getAllObj = async () => {
  try {
    const data = await api.get('/administracion/indice-acciones-correctivas');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(
      `/administracion/indice-acciones-correctivas/${id}`
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/indice-acciones-correctivas/${id}`,
      payload
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post(
      '/administracion/indice-acciones-correctivas',
      payload
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(
      `/administracion/indice-acciones-correctivas/${id}`
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
