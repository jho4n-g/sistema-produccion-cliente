import { z } from 'zod';

import {
  reqStr,
  optNum,
  reqTime,
  optStr,
  optTimeAllowEmpty,
} from '../../convert.js';

const TablaAtomizadoDatos = z.object({
  hora: reqTime('Hora'),
  pba1_bareas: optNum('pba1 bares'),
  pa1_bareas: optNum('pa1 bares'),
  pba2_bareas: optNum('pba2 bares'),
  pa2_bareas: optNum('pa2 bares'),
  pba3_bareas: optNum('pba3 bares'),
  pa3_bareas: optNum('pa3 bares'),
  te_c1: optNum('te c1'),
  te_c2: optNum('te c2'),
  ts_c: optNum('ts c'),
  as: optNum('as'),
  humedad_uno: optNum('Humedad uno'),
  humedad_dos: optNum('Humedad dos'),
  humedad_tres: optNum('Humedad tres'),
  silo_descarga: optNum('Silo Descarga'),
  producto: optStr('Producto'),
  n_silo_llenos: optNum('n silo llenos'),
});

const ControlFosasDatos = z.object({
  label: optStr('label'),
  densidad: optNum('Densidad'),
  viscosidad: optNum('Viscosidad'),
  residuo: optNum('Residuo'),
});

const ControlGranulometiraDatos = z.object({
  hora: optTimeAllowEmpty('Hora'),
  silo_n: optNum('silo n'),
  humedad: optNum('Humedad'),
  malla_35: optNum('Malla 35'),
  malla_40: optNum('Mall 40'),
  malla_50: optNum('Malla 50'),
  malla_70: optNum('Mall 70'),
  malla_100: optNum('Malla 100'),
  malla_120: optNum('Malla 120'),
  fondo: optNum('fondo'),
});

const observacionesAtomizadoDatos = z.object({
  observacion: reqStr('Observacion'),
});

export const DatosAtomizado = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  hora_inicio: reqTime('Hora inicio'),
  hora_final: reqTime('Hora Final'),
  operador: reqStr('Operador'),
  supervisor_turno: reqStr('Supervisor de turno'),
  tabla_atomizado: z.array(TablaAtomizadoDatos).min(0).max(8).default([]),
  control_granulometria: z
    .array(ControlGranulometiraDatos)
    .min(0)
    .max(4)
    .default([]),
  control_fosas: z.array(ControlFosasDatos).min(0).max(3).default([]),
  observacionesAtomizadoDatos: z
    .array(observacionesAtomizadoDatos)
    .min(0)
    .default([]),
});
