import { z } from 'zod';

import { reqPeriodo, optNum, optStr } from '../../convert.js';

export const DatosProductoNoConforme = z.object({
  no_conformidad: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  periodo: reqPeriodo('periodo'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  producto: optNum('producto'),
  no_conformidad_descripcion: optStr('no_conformidad_descripcion'),
  desvios: optNum('desvios'),
  cantidad_rechazado: optStr('cantidad_rechazado'),
  cantidad_recuperada_extra_a: optNum('cantidad_recuperada_extra_a'),
  cantidad_recuperada_extra_b: optNum('cantidad_recuperada_extra_b'),
  cantidad_recuperada_extra_c: optNum('cantidad_recuperada_extra_c'),
  cantidad_recuperada_extra_d: optNum('cantidad_recuperada_extra_d'),
  cantidad_recuperada_extra_dd: optNum('cantidad_recuperada_extra_dd'),
  cantidad_recuperada_calibre_c1: optNum('cantidad_recuperada_calibre_c1'),
  cantidad_recuperada_calibre_c2c4: optNum('cantidad_recuperada_calibre_c2c4'),
  cantidad_recuperada_calibre_c3: optNum('cantidad_recuperada_calibre_c3'),
  cantidad_recuperada_standard: optNum('cantidad_recuperada_standard'),
  cantidad_recuperada_oferta: optNum('cantidad_recuperada_oferta'),
  cantidad_recuperada_casco: optNum('cantidad_recuperada_casco'),
  estado: optNum('estado'),
  observacion: optStr('observacion'),
});
