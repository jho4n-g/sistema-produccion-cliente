import { z } from 'zod';

import { optNum, reqPct } from '../convert.js';

export const DatosHorasExtra = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
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
});

export const DatosMetaHorasExtra = z.object({
  meta: reqPct('Meta'),
});
