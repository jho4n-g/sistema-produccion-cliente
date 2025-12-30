import { z } from 'zod';

import { optNum, reqPeriodo } from '../convert.js';

export const DatosDonaciones = z.object({
  periodo: reqPeriodo('periodo'),
  produccion_menual: optNum('produccion_menual'),
  cascote_mensual: optNum('cascote_mensual'),
  donacion: optNum('donacion'),
});
