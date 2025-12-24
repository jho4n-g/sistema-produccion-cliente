import { cuid2, z } from 'zod';

import {
  reqNum,
  reqPct,
  reqStr,
  reqFloat,
  optNum,
  reqTime,
  optStr,
} from '../../convert.js';

const DatosObservaciones = z.object({
  observacion: reqStr('Obervaciones Esmalte'),
});

const DatosTabla = z.object({
  hora: reqTime('hora'),
  operador_apl_pasta1: optNum('operador_apl_pasta1'),
  sp_apl_pasta1: optNum('sp_apl_pasta1'),
  operador_v_pasta1: optNum('operador_v_pasta1'),
  sp_v_pasta1: optNum('sp_v_pasta1'),
  operador_d_pasta1: optNum('operador_d_pasta1'),
  sp_d_pasta1: optNum('sp_d_pasta1'),
  operador_apl_pasta2: optNum('operador_apl_pasta2'),
  sp_apl_pasta2: optNum('sp_apl_pasta2'),
  operador_v_pasta2: optNum('operador_v_pasta2'),
  sp_v_pasta2: optNum('sp_v_pasta2'),
  operador_d_pasta2: optNum('operador_d_pasta2'),
  sp_d_pasta2: optNum('sp_d_pasta2'),
  operador_apl_pasta3: optNum('operador_apl_pasta3'),
  sp_apl_pasta3: optNum('sp_apl_pasta3'),
  operador_v_pasta3: optNum('operador_v_pasta3'),
  sp_v_pasta3: optNum('sp_v_pasta3'),
  operador_d_pasta3: optNum('operador_d_pasta3'),
  sp_d_pasta3: optNum('sp_d_pasta3'),
  operador_apl_pasta4: optNum('operador_apl_pasta4'),
  sp_apl_pasta4: optNum('sp_apl_pasta4'),
  operador_v_pasta4: optNum('operador_v_pasta4'),
  sp_v_pasta4: optNum('sp_v_pasta4'),
  operador_d_pasta4: optNum('operador_d_pasta4'),
  sp_d_pasta4: optNum('sp_d_pasta4'),
});

export const DatosSerigrafia = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  producto: reqStr('Producto'),
  linea: reqStr('Linea'),
  supervisor_turno: reqStr('Supervisor de turno'),
  operador: reqStr('Operador'),
  pasta1: optStr('Pasta 1'),
  pasta2: optStr('Pasta 2'),
  pasta3: optStr('Pasta 3'),
  pasta4: optStr('Pasta 4'),
  observacionesSer: z.array(DatosObservaciones).default([]),
  datos_tabla_serigrafiado: z.array(DatosTabla).max(8).default([]),
});
