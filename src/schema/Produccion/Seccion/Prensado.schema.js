import { z } from 'zod';

import { reqNum, reqStr, reqFloat, optNum, reqTime } from '../../convert.js';

const DatosObservaciones = z.object({
  observacion: reqStr('Obervaciones'),
});

const TablaPrensadoSecadoDatos = z.object({
  hora: reqTime('Hora'),
  hum_polvo: optNum('hum_polvo'),
  masa_molde_uno: optNum('masa_molde_uno'),
  masa_molde_dos: optNum('masa_molde_dos'),
  masa_molde_tres: optNum('masa_molde_tres'),
  masa_molde_cuatro: optNum('masa_molde_cuatro'),
  masa_molde_cinco: optNum('masa_molde_cinco'),
  masa_molde_seis: optNum('masa_molde_seis'),
  masa_molde_siete: optNum('masa_molde_siete'),
  espesor_molde_uno_a: optNum('Espesor molde uno a '),
  espesor_molde_uno_b: optNum('Espesor molde uno b'),
  espesor_molde_dos_a: optNum('Espesor molde dos a'),
  espesor_molde_dos_b: optNum('Espesor molde dos b'),
  espesor_molde_tres_a: optNum('Espesor molde tres a'),
  espesor_molde_tres_b: optNum('Espesor molde tres b'),
  espesor_molde_cuatro_a: optNum('Espesor molde cuatro a'),
  espesor_molde_cuatro_b: optNum('Espesor molde cuatro b'),
  espesor_molde_cinco_a: optNum('Espesor molde cinco a'),
  espesor_molde_cinco_b: optNum('Espesor molde cinco b'),
  espesor_molde_seis_a: optNum('Espesor molde seis a'),
  espesor_molde_seis_b: optNum('Espesor molde seis b'),
  espesor_molde_siete_a: optNum('Espesor molde siete a'),
  espesor_molde_siete_b: optNum('Espesor molde siete b'),
  mallas_35: optNum('mallas 35'),
  mallas_40: optNum('mallas 40'),
  mallas_50: optNum('mallas 50'),
  mallas_70: optNum('mallas 70'),
  mallas_100: optNum('mallas 100'),
  mallas_120: optNum('mallas 120'),
  font: optNum('Fond'),
});

const tableSilos = z.object({
  n_silo: reqNum('n_silo'),
  humedad: reqFloat('Humedad'),
});

export const datosPrensadoSecado = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  n_prensa: reqNum('n prensa'),
  formato: reqStr('formato'),
  supervisor_turno: reqStr('supervisor de turno'),
  operador: reqStr('Operador'),
  producto: reqStr('Producto'),
  hum_salida_secadora: optNum('Hum salida secadora'),
  temp_secadero_t1: optNum('temp_secadero_t1'),
  temp_secadero_t2: optNum('temp_secadero_t2'),
  temp_secadero_t3: optNum('temp_secadero_t3'),
  temp_secadero_t4: optNum('temp_secadero_t4'),
  temp_secadero_t5: optNum('temp_secadero_t5'),
  temp_secadero_t6: optNum('temp_secadero_t6'),
  ciclo_secadero: optNum('ciclo_secadero'),
  presion_especifica: optNum('presion_especifica'),
  golpes_inicial: optNum('golpes_inicial'),
  golpes_final: optNum('golpes_final'),
  total_golpes: optNum('total_golpes'),
  tabla_prensado_secado: z.array(TablaPrensadoSecadoDatos).default([]),
  observaciones_prensado_secado: z.array(DatosObservaciones).default([]),
  tabla_silos_usado: z.array(tableSilos).default([]),
});
