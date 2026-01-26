import { z } from 'zod';

import { reqStr, optNum, reqPeriodo, reqEntero } from '../convert.js';

export const DatosConsultorioDental = z.object({
  periodo: reqPeriodo('periodo'),
  n_trabajadores: reqEntero('n_trabajadores'),
  produccion: optNum('produccion'),
  consultas_preventivas_trabajadores: reqEntero(
    'consultas_preventivas_trabajadores',
  ),
  consultas_curativas_trabajadores: reqEntero(
    'consultas_curativas_trabajadores',
  ),
  consultas_preventivas_familiares: reqEntero(
    'consultas_preventivas_familiares',
  ),
  consultas_curativas_familiares: reqEntero('consultas_curativas_familiares'),
  observacion: reqStr('Observacion'),
});
