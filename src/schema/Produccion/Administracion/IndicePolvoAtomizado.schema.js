import { z } from 'zod';

import { reqFloat } from '../../convert.js';

export const DatosIndicePolvoAtomizado = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion: reqFloat('produccion'),
  consumo_mensual: reqFloat('consumo_mensual'),
});

export const DatosMetaPolvoAtomizado = z.object({
  meta_kg_m: reqFloat('Meta kg/m'),
});
