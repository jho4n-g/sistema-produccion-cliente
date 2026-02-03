import { z } from 'zod';

import { optNum, reqPct } from '../../convert.js';

export const DatosProduccion = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  presupuesto: optNum('presupuesto'),
  produccion_mensual: optNum('produccion_mensual'),
});

export const DatosMetaProduccion = z.object({
  meta: reqPct('Meta'),
});
