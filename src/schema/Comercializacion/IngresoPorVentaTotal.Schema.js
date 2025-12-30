import { z } from 'zod';

import { reqPeriodo, optNum, optPct } from '../convert.js';

export const DatosIngresoPorVentaTotal = z.object({
  periodo: reqPeriodo('periodo'),
  presupuesto_mensual: optNum('pesupuesto_mensual'),
  venta_mensual_con_otro_ingresos: optNum('venta_mensual_con_otro_ingresos'),
  venta_mensual_ceramica: optNum('venta_mensual_ceramica'),
  otros_ingresos: optNum('otros_ingresos'),
  meta: optPct('meta'),
});
