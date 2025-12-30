import { z } from 'zod';

import { reqPeriodo, optNum, optPct } from '../convert.js';

export const DatosVentaTotal = z.object({
  periodo: reqPeriodo('periodo'),
  presupuesto_mensual: optNum('pesupuesto_mensual'),
  venta_mensual: optNum('venta_mensual'),
  meta: optPct('meta'),
});
