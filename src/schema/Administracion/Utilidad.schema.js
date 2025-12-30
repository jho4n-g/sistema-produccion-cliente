import { z } from 'zod';

import { optNum, reqPeriodo } from '../convert.js';

export const DatosUtilidad = z.object({
  periodo: reqPeriodo('periodo'),
  utilidad_mensual: optNum('Horas extra total'),
  meta_mensual: optNum('Adm'),
  meta: optNum('Prd'),
  cumplimiento_mensual: optNum('Mantto'),
});
