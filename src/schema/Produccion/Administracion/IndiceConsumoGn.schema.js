import { z } from 'zod';

import { reqFloat } from '../../convert.js';

export const DatosIndiceConsumoGn = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion: reqFloat('produccion'),
  consumo_gas_natural: reqFloat('consumo_mensual'),
});
export const DatosMetaGn = z.object({
  meta: reqFloat('Meta'),
  meta_pc_m: reqFloat('Meta gr/m'),
});
