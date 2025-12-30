import { z } from 'zod';

import { reqNum, reqPeriodo, optNum, optPct } from '../../convert.js';

export const DatosIndiceConsumoGn = z.object({
  periodo: reqPeriodo('periodo'),
  produccion: optNum('produccion'),
  consumo_gas_natural: optNum('consumo_mensual'),
  meta: optPct('meta'),
});
