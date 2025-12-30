import { api } from '../api';

export const getDocumentos = async () => {
  try {
    const data = await api.get('/documento/general');
    return data.data;
  } catch (e) {
    if (e.code == 'ERR_NETWORK') {
      return {
        ok: false,
        message: 'Error en el servidor',
      };
    }
    return e.response.data;
  }
};
