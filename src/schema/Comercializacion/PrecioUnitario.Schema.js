import { z } from 'zod';

import { optNum, reqFecha, reqPct } from '../convert.js';

export const DatosPrecioUnitario = z.object({
  fecha: reqFecha(),
  presupuesto_mensual: optNum('presupuesto_mensual'),
  precio_promedio: optNum('precio_promedio'),
  region_centro: optNum('region_centro'),
  region_este: optNum('region_este'),
  region_oeste: optNum('region_oeste'),
  fabrica: optNum('fabrica'),
  exportacion: optNum('exportacion'),
});

export const DatosMetaPrecioUnitario = z.object({
  meta: reqPct('Meta'),
});
