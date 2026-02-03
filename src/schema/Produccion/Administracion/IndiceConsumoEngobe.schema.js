import { z } from 'zod';

import { optNum, reqFloat } from '../../convert.js';

export const DatosIndiceConsumoEngobe = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion: optNum('produccion'),
  consumo_mensual: optNum('consumo_mensual'),
});

export const DatosMetaEngobe = z.object({
  meta: reqFloat('Meta'),
  meta_gr_m: reqFloat('Meta gr/m'),
});
