import { z } from 'zod';
import { reqFecha, reqStr, reqFloat } from '../convert.js';

export const DatosContrato = z.object({
  n_contrato_cite: reqStr('n_contrato_cite'),
  area_contrato: reqStr('area_contrato'),
  empresa: reqStr('empresa'),
  proveedor: reqStr('proveedor'),
  objeto: reqStr('objeto'),
  monto_contrato: reqFloat('monto_contrato'),
  fecha_inicio: reqFecha('fecha_inicio'),
  finalizacion_contrato: reqFecha('finalizacion_contrato'),
});
