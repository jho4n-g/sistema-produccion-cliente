import { api } from '../../api.js';

export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/serigrafia', payload);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getObjs = async () => {
  try {
    // console.log('En service barbotina');
    const data = await api.get('/produccion/serigrafia');
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/produccion/serigrafia/${id}`);

    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/produccion/serigrafia/${id}`, updateddata);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/serigrafia/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
