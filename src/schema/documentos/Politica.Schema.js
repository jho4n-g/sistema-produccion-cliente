import { z } from 'zod';

import { reqStr } from '../convert.js';

export const DatosPolitica = z.object({
  titulo: reqStr('title'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  fecha_aprobado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  codigo: reqStr('codigo'),
  descripcion: reqStr('Descripcion'),
  revision: reqStr('revsion'),
});
