import { z } from 'zod';

import { optNum, reqPeriodo } from '../convert.js';

export const DatosIndiceAccionesCorrectivas = z.object({
  periodo: reqPeriodo('periodo'),
  direccionamiento_estrategico: optNum('direccionamiento_estrategico'),
  comercial_fabrica: optNum('comercial_fabrica'),
  comercial_blanco_galindos: optNum('comercial_blanco_galindos'),
  gestion_integral: optNum('gestion_integral'),
  produccion: optNum('produccion'),
  diseño_desarrollo: optNum('diseño_desarrollo'),
  marketing_comercializacion: optNum('marketing_comercializacion'),
  control_calidad: optNum('control_calidad'),
  desarrollo_humano: optNum('desarrollo_humano'),
  almacenamiento_adquisiciones: optNum('almacenamiento_adquisiciones'),
  mantenimiento: optNum('mantenimiento'),
  gestion_administrativa_contable: optNum('gestion_administrativa_contable'),
});
