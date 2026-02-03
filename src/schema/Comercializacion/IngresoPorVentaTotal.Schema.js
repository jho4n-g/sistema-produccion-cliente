import { z } from 'zod';

import { reqFecha, reqFloat, reqPct } from '../convert.js';

export const DatosIngresoPorVentaTotal = z.object({
  fecha: reqFecha(),
  presupuesto_mensual: reqFloat('pesupuesto_mensual'),
  venta_mensual_con_otro_ingresos: reqFloat('venta_mensual_con_otro_ingresos'),
  venta_mensual_ceramica: reqFloat('venta_mensual_ceramica'),
  otros_ingresos: reqFloat('otros_ingresos'),
});

export const DatosMetaIngresoVentaTotal = z.object({
  meta: reqPct('Meta'),
});
