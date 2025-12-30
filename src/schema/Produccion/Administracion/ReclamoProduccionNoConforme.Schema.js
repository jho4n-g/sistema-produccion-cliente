import { z } from 'zod';

import { reqPeriodo, optNum, optStr } from '../../convert.js';

export const DatosReclamosProduccionNoConforme = z.object({
  periodo: reqPeriodo('periodo'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  nro: optNum('Nro'),
  cliente: optStr('cliente'),
  reclamo: optStr('reclamo'),
  defecto: optStr('defecto'),
  producto: optStr('producto'),
  fecha_produccion: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  cantidad: optNum('cantidad'),
  devolucion_producto: optNum('devolucion_producto'),
  devolucion_economica: optNum('devolucion_economica'),
  procedente: optNum('procedente'),
  no_precedente: optNum('no_precedente'),
  estado: optNum('estado'),
});
