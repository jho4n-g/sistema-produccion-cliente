import { z } from 'zod';

import { reqPeriodo, optNum, optPct } from '../convert.js';

export const DatosDisponibilidaPorLinea = z.object({
  periodo: reqPeriodo('periodo'),
  n_horas_productivas_planificadas: optNum('n_horas_productivas_planificadas'),
  n_horas_lineas_paradas_linea_b: optNum('n_horas_lineas_paradas_linea_b'),
  n_horas_lineas_paradas_line_c: optNum('n_horas_lineas_paradas_line_c'),
  n_horas_lineas_paradas_line_d: optNum('n_horas_lineas_paradas_line_d'),
  meta: optPct('meta'),
});
