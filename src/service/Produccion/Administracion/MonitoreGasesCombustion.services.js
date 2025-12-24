import { api } from '../../api';

export const getAllObj = async () => {
  try {
    const data = await api.get('/produccion/monitoreo-gases-combustion/');
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/produccion/monitoreo-gases-combustion/${id}`,
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
    const data = await api.post(
      '/produccion/monitoreo-gases-combustion/',
      payload
    );
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(
      `/produccion/monitoreo-gases-combustion/${id}`
    );
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
