import { z } from 'zod';

import {
  reqNum,
  reqPeriodo,
  optNum,
  optPct,
  optStr,
  reqStr,
} from '../lib/convert.js';

export const DatosNovedad = z.object({
  titulo: reqStr('titulo'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  descripcion: reqStr('Descripcion'),
  gestion: reqStr('gestion'),
});
