import { z } from 'zod';

export const reqTime = (label) =>
  z
    .string({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser texto`,
    })
    .trim()
    .refine((s) => /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(s), {
      message: `${label} debe tener formato HH:mm o HH:mm:ss`,
    })
    .transform((s) => {
      // Normaliza a HH:mm:ss
      const [hh, mm, ss] = s.split(':');
      return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${(
        ss ?? '00'
      ).padStart(2, '0')}`;
    });

export const optTimeAllowEmpty = (label) =>
  z.preprocess((val) => {
    if (val == null) return undefined; // ✅ null o undefined
    if (typeof val === 'string' && val.trim() === '') return undefined; // ✅ ''
    return val;
  }, reqTime(label).optional());

export const optNum = (label) =>
  z.preprocess(
    (val) => {
      if (val === '' || val == null) return undefined;
      if (typeof val === 'string') {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      }
      return val;
    },
    z
      .number({
        invalid_type_error: `El campo ${label} debe ser numérico`,
      })
      .min(0, `${label} debe ser mayor o igual a 0`)
      .optional(),
  );

export const optStr = (label) => {
  return z
    .string({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser texto`,
    })
    .trim()
    .nullish()
    .optional();
};

export const optPct = (label) =>
  z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      if (typeof val === 'string') return Number(val);
      return val;
    },
    z
      .number({
        invalid_type_error: `El campo ${label} debe ser numérico`,
      })
      .min(0, `${label} debe ser ≥ 0`)
      .max(100, `${label} debe ser ≤ 100`)
      .nullish(), // permite undefined/null
  );

export const reqStr = (label) => {
  return z
    .string({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser texto`,
    })
    .trim()
    .min(1, `El campo ${label} debe ser más de un caracter`);
};

export const reqNum = (label) =>
  z.coerce
    .number({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser numérico`,
    })
    .finite(`${label} debe ser numérico válido`) // ✅ reemplaza refine
    .min(1, `Debe ser mayor o igual a 1`);

export const reqPct = (label) => {
  return reqFloat(label)
    .finite(`${label} debe ser numérico válido`)
    .min(0, `${label} debe ser ≥ 0`)
    .max(100, `${label} debe ser ≤ 100`);
};

export const reqFloat = (label) => {
  return z.coerce
    .number({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser numérico`,
    })
    .finite(`${label} debe ser numérico válido`)
    .min(1, `Debe se mas de un caracter ${label} `);
};

export const reqPeriodo = (label = 'Período') => {
  return (
    (val) => {
      // Si viene undefined, null o cualquier cosa rara → lo tratamos como ''
      if (typeof val !== 'string') return '';
      return val;
    },
    z
      .string({
        required_error: `${label} es requerido`,
        invalid_type_error: `${label} debe ser una cadena de texto`,
      })
      .min(1, `${label} es requerido`)
      .regex(
        /^\d{4}-\d{2}$/,
        `${label}: Formato inválido. Use YYYY-MM (ej: 2024-01)`,
      )
      // 👉 validar MES usando solo el segundo valor
      .refine((value) => {
        const [, month] = value.split('-').map(Number); // [year, month]
        return month >= 1 && month <= 12;
      }, `${label}: Mes debe estar entre 01 y 12`)
      // 👉 validar AÑO usando solo el primer valor
      .refine((value) => {
        const [year] = value.split('-').map(Number); // [year]
        return year >= 2000 && year <= 2100;
      }, `${label}: Año debe estar entre 2000 y 2100`)
  );
};

export const reqEntero = (label = 'Valor') =>
  z.preprocess(
    (val) => {
      if (val === '') return undefined;
      if (typeof val === 'string') return Number(val);
      return val;
    },
    z
      .number({
        invalid_type_error: `El campo ${label} debe ser numérico`,
      })
      .int(`${label} debe ser un número entero`)
      .min(0, `${label} debe ser mayor o igual a 0`)
      .optional(),
  );

export const reqEnteroMayorCero = (label) => {
  return z.coerce
    .number({
      required_error: `Se requiere ${label}`,
      invalid_type_error: `El campo ${label} debe ser numérico`,
    })
    .finite(`${label} debe ser numérico válido`)
    .min(1, `Debe se mas de un caracter ${label} `)
    .int(`${label} debe ser un número entero`);
};
