import { z } from 'zod';
import { reqStr } from '../../convert.js';

export const DatosLinea = z.object({
  nombre: reqStr('nombre de la linea'),
  alias: reqStr('alias de la linea'),
});
