import { z } from 'zod';

import { reqStr, optNum, reqTime, optStr } from '../../convert.js';

const DatosObservacionesEsmalte = z.object({
  observacion: reqStr('Obervaciones Esmalte'),
});

const TablaDatosEsmalte = z.object({
  hora: reqTime('Hora Esmalte Tabla'),
  operador_aplicacion_agua: optNum('operado aplicacion agua'),
  sup_prod_aplicacion_agua: optNum('sup prod aplicaicon agua'),
  operador_aplicacion_engobe: optNum('Operador alplicaicon engobe'),
  sup_prod_aplicacion_engobe: optNum('sup prod aplicacion engobel'),
  operador_vizcosidad_normal: optNum('operador viscosidad normal'),
  sup_prod_vizcosidad_normal: optNum('sup prod viscosidad normal'),
  operador_densidad_recuperado: optNum('operador densidad recuperado'),
  sup_prod_densidad_recuperado: optNum('sup prod densidad recuperado'),
  operador_residuo_implemeable: optNum('operador residuo implemeable'),
  sup_prod_residuo_implemeable: optNum('sup prod residuio implemeable'),
  operador_aplicacion_esmalte: optNum('operador aplicacion esmaltes'),
  sup_prod_aplicacion_esmalte: optNum('sup orod aplicaicon esmalte'),
  operador_vizcosidad_brillante_recuperado: optNum(
    'operador viscosidad brillante recuperado'
  ),
  sup_prod_vizcosidad_brillante_recuperado: optNum(
    'sup prod viscosidad brillante recuperado'
  ),
  operador_densidad_transparente_satinado: optNum(
    'operadoe densidad transparente satinado'
  ),
  sup_prod_densidad_transparente_satinado: optNum(
    'sup prod densidad transtarente satinad'
  ),
  operador_residuo_digital_blanco: optNum('operador residuo digital blanco'),
  sup_prod_residuo_digital_blanco: optNum('sup prod residuo digital blanco'),
});

export const DatosEsmalte = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),

  producto: reqStr('Producto'),
  linea: reqStr('Linea'),
  operador: reqStr('Operador'),
  supervisor_turno: reqStr('Supervisor turno'),
  agua_aplicacion: optStr('Agual aplicacion'),
  normal_viscosidad: optStr('Normal viscosidad'),
  recuperado_densidad: optStr('Recuperado densidad'),
  implemeable_residuo: optStr('Implemeable residuio'),
  brillante_viscosidad: optStr('Brillantes viscosidad'),
  recuperado_viscosidad: optStr('Recuperado viscosidad'),
  tranparente_densidad: optStr('Transparente densidad'),
  satinado_densidad: optStr('Satinado Densidad'),
  digital_residuo: optStr('Digital residuo'),
  blanco_residuo: optStr('Blanco residuio'),
  datos_tabla_esmalte: z.array(TablaDatosEsmalte).min(0).max(8).default([]),
  observaciones_esmalte: z.array(DatosObservacionesEsmalte).default([]),
});
