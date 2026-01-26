import { z } from 'zod';

import { reqFloat, reqPct } from '../../convert.js';

export const DatosCalidad = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion_mensual: reqFloat('produccion_mensual'),
  presupuesto: reqFloat('presupuesto'),
  produccion_primera_mensual: reqFloat('produccion_primera_mensual'),
  produccion_segunda_mensual: reqFloat('produccion_segunda_mensual'),
  produccion_tercera_mensual: reqFloat('produccion_tercera_mensual'),
  produccion_cascote_mensual: reqFloat('produccion_cascote_mensual'),
});

export const DatosMetaCalidad = z.object({
  meta_primera: reqPct('Meta primera'),
  meta_cascote: reqPct('Meta_cascote'),
});
