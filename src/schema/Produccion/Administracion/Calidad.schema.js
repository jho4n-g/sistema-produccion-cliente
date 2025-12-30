import { z } from 'zod';

import { reqPeriodo, optNum, optPct } from '../../convert.js';

export const DatosCalidad = z.object({
  periodo: reqPeriodo('periodo'),
  produccion_mensual: optNum('produccion_mensual'),
  presupuesto: optNum('presupuesto'),
  produccion_primera_mensual: optNum('produccion_primera_mensual'),
  produccion_segunda_mensual: optNum('produccion_segunda_mensual'),
  produccion_tercera_mensual: optNum('produccion_tercera_mensual'),
  produccion_cascote_mensual: optNum('produccion_cascote_mensual'),

  meta_primera_calidad: optPct('meta_primera_calidad'),
  meta_cascote_calidad: optPct('meta_cascote_calidad'),
});
