import { z } from 'zod';

import { reqPeriodo, optNum, optPct } from '../convert.js';

export const DatosPrecioUnitario = z.object({
  periodo: reqPeriodo('periodo'),
  presupuesto_mensual: optNum('presupuesto_mensual'),
  precio_promedio: optNum('precio_promedio'),
  region_centro: optNum('region_centro'),
  region_este: optNum('region_este'),
  region_oeste: optNum('region_oeste'),
  fabrica: optNum('fabrica'),
  exportacion: optNum('exportacion'),
  meta: optPct('meta'),
});
