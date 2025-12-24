import { api } from '../../api';

export const registerObj = async (payload) => {
  try {
    const res = await api.post('/produccion/prensado-secado', payload);
    return res.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};
export const getObjs = async () => {
  try {
    // console.log('service');
    // console.log('En service barbotina');
    const data = await api.get('/produccion/prensado-secado');

    return data.data;
  } catch (e) {
    return e.message;
  }
};

export const getIdObj = async (id) => {
  try {
    const res = await api.get(`/produccion/prensado-secado/${id}`);

    return res.data;
  } catch (e) {
    return e.response.data;
  }
};

export const UpdateIdObj = async (id, updateddata) => {
  try {
    const data = await api.put(
      `/produccion/prensado-secado/${id}`,
      updateddata
    );
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const deleteObj = async (id) => {
  try {
    const data = await api.delete(`/produccion/prensado-secado/${id}`);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};
