import { z } from 'zod';

import { reqFecha, reqPct, reqFloat } from '../convert.js';

export const DatosVentaTotal = z.object({
  fecha: reqFecha(),
  presupuesto_mensual: reqFloat('pesupuesto_mensual'),
  venta_mensual: reqFloat('venta_mensual'),
});

export const DatosMetaVentaTotal = z.object({
  meta: reqPct('Meta'),
});
