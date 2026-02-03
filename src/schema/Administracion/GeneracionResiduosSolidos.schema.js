import { z } from 'zod';

import { optNum } from '../convert.js';

export const DatosGeneracionResidiosSolidos = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD'),
  n_trabajadores: optNum('n trabajadores'),
  kg_carton: optNum('kg carton'),
  pe: optNum('Pe'),
  kg_strechfilm: optNum('kg_strechfilm'),
  kg_bolsas_bigbag: optNum('kg_bolsas_bigbag'),
  kg_turriles_plasticos: optNum('kg_turriles_plasticos'),
  kg_envase_mil_litros: optNum('kg_envase_mil_litros'),
  sunchu_kg: optNum('sunchu_kg'),
  kg_madera: optNum('kg_madera'),
  kg_bidon_azul: optNum('kg_bidon_azul'),
  kg_aceite_sucio: optNum('kg_aceite_sucio'),
  kg_bolsas_plasticas_transparentes: optNum(
    'kg_bolsas_plasticas_transparentes',
  ),
  kg_bolsas_yute: optNum('kg_bolsas_yute'),
});
