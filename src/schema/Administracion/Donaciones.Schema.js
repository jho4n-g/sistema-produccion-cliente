import { z } from 'zod';

import { optNum, reqFecha } from '../convert.js';

export const DatosDonaciones = z.object({
  fecha: reqFecha(),
  produccion_mensual: optNum('produccion_mensual'),
  cascote_mensual: optNum('cascote_mensual'),
  donacion: optNum('donacion'),
});
