import { z } from 'zod';

import { optNum, optStr, reqFecha } from '../convert.js';

export const ReclamoProductoTerminado = z.object({
  fecha: reqFecha('fecha'),
  regional: optStr('Regiona'),
  nro: optNum('nro'),
  cliente: optStr('cliente'),
  reclamo: optStr('reclamo'),
  defecto: optStr('defecto'),
  producto: optStr('producto'),
  fecha_produccion: reqFecha('fecha_produccion'),
  cantidad: optNum('cantidad'),
  devolucion_producto: optStr('devolucion_producto'),
  devolucion_economica: optStr('devolucion_economica'),
  procedente: optStr('procedente'),
  no_procedente: optStr('no_procedente'),
  estado: optStr('estado'),
});
