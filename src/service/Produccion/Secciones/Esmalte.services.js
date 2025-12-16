import { api } from '../../api.js';

export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/esmalte', payload);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getObjs = async () => {
  try {
    // console.log('En service barbotina');
    const data = await api.get('/produccion/esmalte');
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/produccion/esmalte/${id}`);

    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/produccion/esmalte/${id}`, updateddata);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/esmalte/${id}`);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};
