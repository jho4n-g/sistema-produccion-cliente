import { z } from 'zod';

import { reqStr } from '../convert.js';

export const DatosLogin = z.object({
  username: reqStr('username'),
  password: reqStr('password'),
});
