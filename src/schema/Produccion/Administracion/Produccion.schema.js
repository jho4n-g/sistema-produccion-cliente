import { z } from 'zod';

import { reqNum, reqPeriodo, optNum, optPct } from '../../convert.js';

export const DatosProduccion = z.object({
  periodo: reqPeriodo('periodo'),
  presupuesto: optNum('presupuesto'),
  produccion_mensual: optNum('produccion_mensual'),
  meta: optPct('meta'),
});
