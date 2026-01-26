import { z } from 'zod';

import { optNum, reqFloat } from '../../convert.js';

export const DatosIndiceConsumoBases = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion: optNum('produccion'),
  consumo_mensual: optNum('consumo_mensual'),
});
export const DatosMetaBases = z.object({
  meta: reqFloat('meta'),
});
