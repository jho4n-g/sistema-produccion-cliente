import { z } from 'zod';
import { reqFloat, reqStr } from '../convert.js';

export const DatosInventarioMedicina = z.object({
  codigo: reqStr('n_contrato_cite'),
  descripcion: reqStr('area_contrato'),
  cotcion: reqStr('empresa'),
  unidad: reqStr('proveedor'),

  saldo_actual: reqFloat('monto_contrato'),
});
