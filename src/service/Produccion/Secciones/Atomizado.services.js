import { api } from '../../api';

export const getObjs = async () => {
  try {
    const data = await api.get('/produccion/atomizado');
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/atomizado', payload);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/produccion/atomizado/${id}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/produccion/atomizado/${id}`, updateddata);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/atomizado/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
