import { z } from 'zod';

import { optNum, reqFloat } from '../../convert.js';

export const DatosIndiceConsumoEE = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion: optNum('produccion'),
  consumo_energia_electrica: optNum('consumo_energia_electrica'),
});
export const DatosMetaEe = z.object({
  meta: reqFloat('meta'),
});
