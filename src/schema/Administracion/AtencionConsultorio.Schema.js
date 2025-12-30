import { z } from 'zod';

import { reqPeriodo, optNum } from '../convert.js';

export const DatosAtencionConsultorio = z.object({
  periodo: reqPeriodo('periodo'),
  alsbm: optNum('alsbm'),
  alcbm: optNum('alcbm'),
  alegrias: optNum('alegrias'),
  cardivasculares: optNum('cardiovasculares'),
  opticas: optNum('Opticas'),
  cefaleas: optNum('cefaleas'),
  oftamologias: optNum('oftamologias'),
  respiratorias: optNum('respiratorias'),
  digestivas: optNum('digestivas'),
  genitourinarias: optNum('genitourinarias'),
  musculo_esqueletico: optNum('musculo_esqueletico'),
  articulares: optNum('articulares'),
  columna_vertebras: optNum('columna_vertebras'),
  piel: optNum('piel'),
  neurologias: optNum('neurologias'),
  odontologias: optNum('odontologias'),
  quemaduras: optNum('quemaduras'),
  curaciones: optNum('curaciones'),
  otras: optNum('otras'),
});
