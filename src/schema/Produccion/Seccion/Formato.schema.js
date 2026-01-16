import { z } from 'zod';

import { reqFloat, reqEntero, reqEnteroMayorCero } from '../../convert.js';

const detalles_formato_prensa = z.object({
  linea_id: reqEntero('Prensa id'),
  cantidad: reqEntero('cantidad'),
});

export const DatosFormato = z.object({
  nombre_formato: z
    .string()
    .regex(/^\d+x\d+$/, 'Formato: ANCHOxALTO (ej: 20x20)'),
  caja_metros: reqFloat('Caja metros'),
  caja_piezas: reqEnteroMayorCero('Caja piezas'),
  piezas_metro: reqFloat('Piezas metro'),
  detalles: z.array(detalles_formato_prensa).min(1).default([]),
});
