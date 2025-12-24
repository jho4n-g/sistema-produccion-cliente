import { api } from '../../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/produccion/indice-consumo-engobe/');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/produccion/indice-consumo-engobe/${id}`,
      payload
    );
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const registerObj = async (payload) => {
  try {
    const data = await api.post('/produccion/indice-consumo-engobe/', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/indice-consumo-engobe/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
