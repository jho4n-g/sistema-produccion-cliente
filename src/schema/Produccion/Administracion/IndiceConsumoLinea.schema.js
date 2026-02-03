import { z } from 'zod';

import { reqFloat } from '../../convert.js';

export const DatosIndiceConsumoLinea = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion: reqFloat('Produccion'),
  consumo_mensual: reqFloat('Consumo mensual'),
});

export const DatosMetaLinea = z.object({
  meta_gr_m: reqFloat('Meta gr/m'),
});
