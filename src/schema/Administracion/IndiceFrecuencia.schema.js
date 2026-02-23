import { z } from 'zod';

import { optNum, reqPct, reqFecha } from '../convert.js';

export const DatosIndiceFrecuencia = z.object({
  fecha: reqFecha(),
  n_trabajadores: optNum('n_trabajadores'),
  porcentaje_ausentismo: optNum('porcentaje_ausentismo'),
  accidentes_administracion_personas: optNum(
    'accidentes_administracion_personas',
  ),
  accidentes_mantenieminto_personas: optNum(
    'accidentes_mantenieminto_personas',
  ),
  accidentes_produccion_personas: optNum('accidentes_produccion_perssonas'),
  accidentes_comercializacion_personas: optNum(
    'accidentes_comercializacion_personas',
  ),
});

export const DatosMetaFrecuencia = z.object({
  meta: reqPct('Meta'),
});
