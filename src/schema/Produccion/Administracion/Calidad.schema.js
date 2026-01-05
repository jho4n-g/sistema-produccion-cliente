import { z } from 'zod';

import { reqPeriodo, reqNum, reqPct } from '../../convert.js';

export const DatosCalidad = z.object({
  periodo: reqPeriodo('periodo'),
  produccion_mensual: reqNum('produccion_mensual'),
  presupuesto: reqNum('presupuesto'),
  produccion_primera_mensual: reqNum('produccion_primera_mensual'),
  produccion_segunda_mensual: reqNum('produccion_segunda_mensual'),
  produccion_tercera_mensual: reqNum('produccion_tercera_mensual'),
  produccion_cascote_mensual: reqNum('produccion_cascote_mensual'),

  meta_primera_calidad: reqPct('meta_primera_calidad'),
  meta_cascote_calidad: reqPct('meta_cascote_calidad'),
});
