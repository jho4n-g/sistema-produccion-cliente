import { api } from '../api';
import { toServiceError } from '../error';

export const getDocumentos = async () => {
  try {
    const data = await api.get('/documento/general');
    return data.data;
  } catch (e) {
    return toServiceError(e);
  }
};

export const getDocumentosProcedimientoPolitica = async () => {
  try {
    const data = await api.get('/documento/general/procedimientos-politicas');
    return data.data;
  } catch (e) {
    console.log(e);
    return toServiceError(e);
  }
};
