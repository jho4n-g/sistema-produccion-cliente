import { z } from 'zod';

import { reqStr, optNum, reqPeriodo, reqEntero } from '../convert.js';

const Observaciones = z.object({ observacion: reqStr('Observacion') });

export const DatosConsultorioDental = z.object({
  periodo: reqPeriodo('periodo'),
  n_trabajadores: reqEntero('n_trabajadores'),
  produccion: optNum('produccion'),
  consultas_preventivas_trabajadores: reqEntero(
    'consultas_preventivas_trabajadores'
  ),
  consultas_curativas_trabajadores: reqEntero(
    'consultas_curativas_trabajadores'
  ),
  consultas_preventivas_familiares: reqEntero(
    'consultas_preventivas_familiares'
  ),
  consultas_curativas_familiares: reqEntero('consultas_curativas_familiares'),
  observacionesConsultorioDental: z
    .array(Observaciones)
    .min(0)
    .max(4)
    .default([]),
});
