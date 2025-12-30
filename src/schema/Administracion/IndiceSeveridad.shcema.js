import { z } from 'zod';

import { optNum, reqPeriodo, optPct, reqEntero } from '../convert.js';

export const DatosIndiceSeveridad = z.object({
  periodo: reqPeriodo('periodo'),
  n_trabajadores: optNum('n_trabajadores'),
  porcentaje_ausentismo: optNum('porcentaje_ausentismo'),
  dias_baja_medica_administracion: reqEntero('dias_baja_medica_administracion'),
  dias_baja_medica_mantenimiento: reqEntero('dias_baja_medica_mantenimiento'),
  dias_baja_medica_produccion: reqEntero('dias_baja_medica_produccion'),
  dias_baja_medica_comercializacion: reqEntero(
    'dias_baja_medica_comercializacion'
  ),
  meta: optPct('meta'),
});
