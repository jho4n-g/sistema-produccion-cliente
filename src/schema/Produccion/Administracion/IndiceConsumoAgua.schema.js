import { z } from 'zod';

import { optNum, reqNum, reqFloat } from '../../convert.js';

export const DatosIndiceConsumoAgua = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  produccion: reqNum('produccion'),
  cisterna_agua: optNum('cisterna_agua'),
  medidor_subestacion_ee: optNum('medidor_subestacion_ee'),
  medidor_tres_produccion: optNum('medidor_tres_produccion'),
  medidor_cuatro_eliza: optNum('medidor_cuatro_eliza'),
  medidor_cinco_administracion: optNum('medidor_cinco_administracion'),
  medidor_seis_arcilla: optNum('medidor_seis_arcilla'),
});

export const DatosMetaAgua = z.object({
  meta: reqFloat('meta'),
});
