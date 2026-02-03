import { z } from 'zod';

import { optNum, reqPct } from '../convert.js';

export const DatosUtilidad = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  utilidad_mensual: optNum('Utilidad mensual'),
  meta_mensual: optNum('Meta mensual'),
});

export const DatosMetaUtilidad = z.object({
  meta: reqPct('Meta'),
});
