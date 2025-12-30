import { z } from 'zod';

import { optNum, reqPeriodo } from '../convert.js';

export const DatosEvolucionContadoContraCredito = z.object({
  periodo: reqPeriodo('periodo'),
  ventas_brutas_mes_nacionel: optNum('ventas_brutas_mes_nacionel'),
  creditos_periodo_nacionel: optNum('creditos_periodo_nacionel'),
  saldo_credito_acumulado: optNum('saldo_credito_acumulado'),
  dias_demora_dempresa_recuperado_venta: optNum(
    'dias_demora_dempresa_recuperado_venta'
  ),
  ventas_brutas_exportacion: optNum('ventas_brutas_exportacion'),
  creditos_periodo_exportacion: optNum('creditos_periodo_exportacion'),
  saldos_creditos_acumulados: optNum('saldos_creditos_acumulados'),
});
