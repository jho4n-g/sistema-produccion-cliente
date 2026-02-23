import { api } from '../api';
import { toServiceError } from '../error';

export const getObjsUser = async (id) => {
  try {
    const data = await api.get(
      `/administracion/reclamo-producto-terminado/cliente/${id}`,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getIdObj = async (id) => {
  try {
    const data = await api.get(
      `/administracion/reclamo-producto-terminado/${id}`,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/reclamo-producto-terminado/${id}`,
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post(
      '/administracion/reclamo-producto-terminado',
      payload,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(
      `/administracion/reclamo-producto-terminado/${id}`,
    );
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
