import { z } from 'zod';

import {
  reqNum,
  reqPeriodo,
  optNum,
  optPct,
  optStr,
  reqStr,
} from '../lib/convert.js';

export const DatosPolitica = z.object({
  titulo: optStr('title'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  fecha_aprobado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  codigo: optStr('codigo'),
  descripcion: optStr('Descripcion'),
  revision: optStr('revsion'),
});
