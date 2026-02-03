import { z } from 'zod';

import { optNum, reqPct } from '../../convert.js';

export const DatosMonitoreoGasesCombustion = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  horno_b: optNum('horno_b'),
  horno_c: optNum('horno_c'),
  horno_d: optNum('horno_d'),
});

export const DatosMetaMonitoreoGases = z.object({
  meta: reqPct('Meta'),
});
