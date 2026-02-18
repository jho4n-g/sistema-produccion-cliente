import { z } from 'zod';
import { reqStr, reqInt, reqIntOptional } from '../convert.js';

export const DatosInventarioMedicina = z.object({
  codigo: reqStr('n_contrato_cite'),
  descripcion: reqStr('area_contrato'),
  cotcion: reqStr('empresa'),
  unidad: reqStr('proveedor'),
  saldo_actual: reqInt('monto_contrato'),
});

export const DatosInventarioMedicinaActualziar = z.object({
  codigo: reqStr('n_contrato_cite'),
  descripcion: reqStr('area_contrato'),
  cotcion: reqStr('empresa'),
  unidad: reqStr('proveedor'),
  sumar_saldo: reqIntOptional('Sumar saldo'),
});

export const DatosActualizarSaldo = z.object({
  actualizar_saldo: reqInt('Saldo'),
});
