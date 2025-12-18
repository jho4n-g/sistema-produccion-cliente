import { api } from '../../api';

export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/barbotina', payload);
    return res.data;
  } catch (e) {
    console.log(e);
    return e.response.data || 'Error del servidor';
  }
};

export const getObjs = async () => {
  try {
    // console.log('En service barbotina');
    const data = await api.get('/produccion/barbotina');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data || 'Error del servidor';
  }
};

export const getIdObj = async (id) => {
  try {
    const data = await api.get(`/produccion/barbotina/${id}`);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data || 'Error del servidor';
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(`/produccion/barbotina/${id}`, updateddata);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data || 'Error del servidor';
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/barbotina/${id}`);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data || 'Error del servidor';
  }
};
