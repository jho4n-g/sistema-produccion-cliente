import { z } from 'zod';

import { reqFloat } from '../../convert.js';

export const DatosIndiceConsumoEsmalte = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion: reqFloat('produccion'),
  consumo_mensual: reqFloat('consumo_mensual'),
});
export const DatosMetaEsmalte = z.object({
  meta: reqFloat('Meta'),
  meta_gr_m: reqFloat('Meta gr/m'),
});
