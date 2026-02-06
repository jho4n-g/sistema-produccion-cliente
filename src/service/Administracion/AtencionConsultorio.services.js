import { api } from '../api';

export const getObjsUser = async (id) => {
  try {
    const data = await api.get(
      `/administracion/atencion-consultorio/cliente/${id}`,
    );
    return data.data;
  } catch (e) {
    console.log(e);
    if (e.code == 'ERR_NETWORK') {
      return {
        ok: false,
        message: 'Error en el servidor',
      };
    }
    return e.response.data;
  }
};

export const updateObj = async (id, payload) => {
  try {
    const data = await api.put(
      `/administracion/atencion-consultorio/${id}`,
      payload,
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
      '/administracion/atencion-consultorio',
      payload,
    );
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/administracion/atencion-consultorio/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
