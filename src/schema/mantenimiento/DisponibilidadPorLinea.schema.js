import { z } from 'zod';

import { optNum, reqPct } from '../convert.js';

export const DatosDisponibilidaPorLinea = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  n_horas_productivas_planificadas: optNum('n_horas_productivas_planificadas'),
  n_horas_lineas_paradas_linea_b: optNum('n_horas_lineas_paradas_linea_b'),
  n_horas_lineas_paradas_linea_c: optNum('n_horas_lineas_paradas_line_c'),
  n_horas_lineas_paradas_linea_d: optNum('n_horas_lineas_paradas_line_d'),
  n_horas_lineas_paradas_linea_e: optNum('n_horas_lineas_paradas_line_d'),
});

export const DatosMetaDisponibilidadLinea = z.object({
  meta: reqPct('Meta'),
});
