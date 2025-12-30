import { z } from 'zod';

import { reqNum, reqPeriodo, optNum, optPct } from '../../convert.js';

export const DatosMonitoreoGasesCombustion = z.object({
  periodo: reqPeriodo('periodo'),
  horno_b: optNum('horno_b'),
  horno_c: optNum('horno_c'),
  horno_d: optNum('horno_d'),
  meta: optPct('meta'),
});
