import { z } from 'zod';

import { reqStr } from '../convert.js';

export const DatosNovedad = z.object({
  titulo: reqStr('titulo'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  descripcion: reqStr('Descripcion'),
  gestion: reqStr('gestion'),
});
