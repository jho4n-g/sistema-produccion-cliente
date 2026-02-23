import { api } from '../api';
import { toServiceError } from '../error';

export const createUser = async (payload) => {
  try {
    const data = await api.post('/user/', payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getUsers = async () => {
  try {
    const data = await api.get('/user');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getIdUser = async (id) => {
  try {
    const data = await api.get(`/user/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const updateUser = async (id, payload) => {
  try {
    const data = await api.put(`/user/${id}`, payload);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
export const deleteUser = async (id) => {
  try {
    const data = await api.delete(`/user/${id}`);
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};
