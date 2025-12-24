import { api } from '../../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/produccion/indice-conusmo-gn/');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(`/produccion/indice-conusmo-gn/${id}`, payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/produccion/indice-conusmo-gn/', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/indice-conusmo-gn/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
