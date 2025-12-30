import { z } from 'zod';

import { reqNum, reqPeriodo, optNum, optPct } from '../../convert.js';

export const DatosIndiceConsumoEE = z.object({
  periodo: reqPeriodo('periodo'),
  produccion: optNum('produccion'),
  consumo_energia_electrica: optNum('consumo_energia_electrica'),
  meta: optPct('meta'),
});
