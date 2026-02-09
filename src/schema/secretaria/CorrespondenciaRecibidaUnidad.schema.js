import { z } from 'zod';
import { reqFecha, reqStr } from '../convert.js';

export const DatosCorrespondencia = z.object({
  fecha: reqFecha('Fecha'),
  cite: reqStr('Cite'),
  referencia: reqStr('Referencia'),
  emitido_por: reqStr('Emitido por'),
  derivado_a: reqStr('Derivado a'),
});
