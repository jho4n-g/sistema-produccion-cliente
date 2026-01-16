import { api } from '../api';

export const LoginUser = async (datos) => {
  try {
    const data = await api.post('/login', datos);
    return data.data;
  } catch (e) {
    return e.response.data;
  }
};

export const getMe = async (config) => {
  try {
    const data = await api.get('/auth/me', config);
    return data.data;
  } catch (e) {
    console.log(e);
    return e.response.data;
  }
};
