import { z } from 'zod';
import { reqFecha, reqStr, reqBooleano, optStr } from '../convert.js';

export const RecibidoExternoSchema = z.object({
  entregado_por: reqStr('Entregado por'),
  fecha_entregado: reqFecha('Fecha entregado'),
  documento: reqStr('Documento'),
  enviado_por: reqStr('Enviado por'),
  descripcion: reqStr('descripcion '),
  entragado_a: optStr('Entragado a'),
  dev: reqBooleano('Derivado a'),
  fecha_devolucion: reqFecha('Fecha devolucion', true),
  derivado_a: optStr('Derivado a'),
});
