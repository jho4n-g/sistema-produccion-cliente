import { api } from '../../api';
import { toServiceError } from '../../error';

export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/nro-prensa', payload);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getObjsPrensa = async () => {
  try {
    const data = await api.get('/produccion/nro-prensa');

    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const getDetallesObjs = async () => {
  try {
    const data = await api.get('/produccion/nro-prensa/detalle');

    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/produccion/nro-prensa/${id}`);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/produccion/nro-prensa/${id}`, updateddata);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/nro-prensa/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
