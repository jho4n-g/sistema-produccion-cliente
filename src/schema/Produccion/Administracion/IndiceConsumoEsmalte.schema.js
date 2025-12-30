import { z } from 'zod';

import { reqNum, reqPeriodo, optNum, optPct } from '../../convert.js';

export const DatosIndiceConsumoEsmalte = z.object({
  periodo: reqPeriodo('periodo'),
  produccion: optNum('produccion'),
  consumo_mensual: optNum('consumo_mensual'),
  meta: optPct('meta'),
});
