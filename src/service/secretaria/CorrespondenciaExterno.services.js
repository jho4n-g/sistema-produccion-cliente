import { api } from '../api';
import { toServiceError } from '../error';

export const getObjs = async () => {
  try {
    const data = await api.get('/secretaria/externo');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const registerObj = async (payload) => {
  try {
    const res = await api.post('/secretaria/externo', payload);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/secretaria/externo/${id}`);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/secretaria/externo/${id}`, updateddata);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/secretaria/externo/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
