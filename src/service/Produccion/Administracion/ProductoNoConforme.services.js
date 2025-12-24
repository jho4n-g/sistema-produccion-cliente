import { api } from '../../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/produccion/producto-no-conforme/');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/produccion/producto-no-conforme/${id}`,
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
    const data = await api.post('/produccion/producto-no-conforme/', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/producto-no-conforme/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
