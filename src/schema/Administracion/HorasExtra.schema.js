import { z } from 'zod';

import { optNum, optPct, reqPeriodo } from '../convert.js';

export const DatosHorasExtra = z.object({
  periodo: reqPeriodo('Periodo'),
  adm: optNum('adm'),
  prd: optNum('prd'),
  mantto: optNum('mantto'),
  ampliacion: optNum('Ampliacion'),
  cc: optNum('CC'),
  seg_ind: optNum('Seg ind'),
  r_centro: optNum('r centro'),
  r_oeste: optNum('r oeste'),
  r_este: optNum('r este'),
  r_fabr: optNum('r fabr'),
  total_personas: optNum('total personas'),
  indice_horas_extras: optNum('Indice horas extra'),
  meta: optPct('Meta'),
});
