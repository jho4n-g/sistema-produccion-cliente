import { api } from '../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/administracion/consultorio-dental');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/consultorio-dental/${id}`,
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
    const data = await api.post('/administracion/consultorio-dental', payload);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/consultorio-dental/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
