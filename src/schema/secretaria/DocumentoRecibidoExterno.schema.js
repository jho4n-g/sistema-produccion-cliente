import { z } from 'zod';
import { reqFecha, reqStr } from '../convert.js';

export const RecibidoExternoSchema = z.object({
  entregado_por: reqStr('Entregado por'),
  fecha_entregado: reqFecha('Fecha entregado'),
  documento: reqStr('Documento'),
  enviado_por: reqStr('Enviado por'),
  descripcion: reqStr('descripcion '),
  entragado_a: reqStr('Entragado a'),
  dev: reqStr('Derivado a'),
  fecha_devolucion: reqFecha('Fecha devolucion'),
  derivado_a: reqStr('Derivado a'),
});
