import { z } from 'zod';

import { reqStr } from '../convert';

export const DatosProcedimiento = z.object({
  titulo: reqStr('titulo'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  fecha_aprobado: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  codigo: reqStr('codigo'),
  revision: reqStr('revision'),
  descripcion: reqStr('descripcion'),
  area: reqStr('area'),
});
