import { z } from 'zod';
import { reqFecha, reqStr } from '../convert.js';

export const DatosCorrespondencia = z.object({
  fecha: reqFecha('fecha'),
  cite: reqStr('cite'),
  referencia: reqStr('Referencia'),
  emitido_por: reqStr('emitido_por'),
});
