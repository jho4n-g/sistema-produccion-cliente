import { z } from 'zod';

import {
  reqPeriodo,
  optNum,
  optStr,
  reqStr,
  reqEntero,
  reqFecha,
} from '../../convert.js';

export const DatosProductoNoConforme = z.object({
  fecha: reqFecha(),

  producto: reqStr('Producto'),
  no_conformidad_descripcion: reqStr('No conformidad'),
  desvios_cajas: reqEntero('Desvio'),
  cantidad_rechazado_cajas: reqEntero('Cantidad rechazado', true),
  cantidad_recuperada_extra_a: reqEntero('Cantidad rechazado', true),
  cantidad_recuperada_extra_b: reqEntero('Cantidad rechazado', true),
  cantidad_recuperada_extra_c: reqEntero('Cantidad rechazado', true),
  cantidad_recuperada_extra_d: reqEntero('Cantidad rechazado', true),
  cantidad_recuperada_extra_dd: reqEntero('Cantidad rechazado', true),
  cantidad_recuperada_calibre_c1_cajas: reqEntero('Cantidad rechazado', true),
  cantidad_recuperada_calibre_c2c4_cajas: reqEntero('Cantidad rechazado', true),
  cantidad_recuperada_calibre_c3_cajas: reqEntero('Cantidad rechazado', true),
  standard: reqEntero('Cantidad rechazado', true),
  oferta: reqEntero('Cantidad rechazado', true),
  casco: reqEntero('Cantidad rechazado', true),
  estado: reqEntero('Cantidad rechazado', true),
  observacion: optStr('Opcionar'),
});
