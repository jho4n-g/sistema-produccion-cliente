import { z } from 'zod';

import { reqPeriodo, optNum, optPct } from '../../convert.js';

export const DatosIndiceConsumoAgua = z.object({
  periodo: reqPeriodo('periodo'),
  produccion: optNum('produccion'),
  consumo_agua: optNum('consumo_agua'),
  cisterna_agua: optNum('cisterna_agua'),
  medidor_subestacion_ee: optNum('medidor_subestacion_ee'),
  medidor_tres_produccion: optNum('medidor_tres_produccion'),
  medidor_cuatro_eliza: optNum('medidor_cuatro_eliza'),
  medidor_cinco_administracion: optNum('medidor_cinco_administracion'),
  medidor_seis_arcilla: optNum('medidor_seis_arcilla'),
  meta: optPct('meta'),
});
