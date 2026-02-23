import { api } from '../../api';
import { toServiceError } from '../../error';

export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/linea', payload);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getObjs = async () => {
  try {
    const data = await api.get('/produccion/linea');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsUnidos = async () => {
  try {
    const data = await api.get('/produccion/linea/unidos');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/produccion/linea/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/produccion/linea/${id}`, updateddata);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/linea/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
