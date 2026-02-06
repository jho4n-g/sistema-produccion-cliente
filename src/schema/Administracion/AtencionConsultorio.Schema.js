import { z } from 'zod';

import { reqPeriodo, optNum, reqFecha } from '../convert.js';

export const DatosAtencionConsultorio = z.object({
  fecha: reqFecha(),
  prestacion_medica_alergias: optNum('prestacion_medica_alergias'),
  prestacion_medica_cardiovasculares: optNum(
    'prestacion_medica_cardiovasculares',
  ),
  prestacion_medica_cefaleas: optNum('prestacion_medica_cefaleas'),
  prestacion_medica_oftamologicas: optNum('prestacion_medica_oftamologicas'),
  prestacion_medica_oticas: optNum('prestacion_medica_oticas'),
  prestacion_medica_respiratorias: optNum('prestacion_medica_respiratorias'),
  prestacion_medica_digestivas: optNum('prestacion_medica_digestivas'),
  prestacion_medica_genitourinarias: optNum(
    'prestacion_medica_genitourinarias',
  ),
  prestacion_medica_musculo_esqueleticas: optNum(
    'prestacion_medica_musculo_esqueleticas',
  ),
  prestacion_medica_odontologia: optNum('prestacion_medica_odontologia'),
  prestacion_medica_quemaduras: optNum('prestacion_medica_quemaduras'),
  prestacion_medica_piel_anexos: optNum('prestacion_medica_piel_anexos'),
  prestacion_medica_otros: optNum('prestacion_medica_otros'),
  prestacion_medica_curaciones: optNum('prestacion_medica_curaciones'),
  prestacion_medica_inyectables: optNum('prestacion_medica_inyectables'),
  control_pa: optNum('control_pa'),
  glicemia_capilar: optNum('glicemia_capilar'),
  riesgo_prof: optNum('riesgo_prof'),
  riesto_comun: optNum('riesto_comun'),
});
