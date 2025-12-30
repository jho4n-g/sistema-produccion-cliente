import { z } from 'zod';

import { reqPeriodo, optNum, optPct } from '../../convert.js';

export const DatosIndiceConsumoBases = z.object({
  periodo: reqPeriodo('periodo'),
  produccion: optNum('produccion'),
  consumo_mensual: optNum('consumo_mensual'),
  meta: optPct('meta'),
});
