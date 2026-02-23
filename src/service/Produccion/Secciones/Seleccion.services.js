import { api } from '../../api.js';
import { toServiceError } from '../../error';

export const registerObj = async (payload) => {
  try {
    const response = await api.post('/produccion/seleccion-embalaje', payload);
    console.log(response);
    return response.data;
  } catch (e) {
    console.log('STATUS:', e?.response?.status);
    console.log('BACKEND:', e?.response?.data);
    console.log('SENT:', e?.config?.data);

    return toServiceError(e);
  }
};

export const getObjs = async () => {
  try {
    const data = await api.get('/produccion/seleccion-embalaje');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/produccion/seleccion-embalaje/${id}`);
    return res.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(
      `/produccion/seleccion-embalaje/${id}`,
      updateddata,
    );
    return data.data;
  } catch (e) {
    console.log('BACKEND:', e?.response?.data);
    return toServiceError(e);
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/seleccion-embalaje/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
