export const normalize = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export function extractArrayFieldErrors(zodError, arrayFieldName) {
  const rows = [];
  for (const issue of zodError.issues) {
    const path = issue.path;
    // esperamos paths como: ['tabla_atomizado', 3, 'pba1_bareas']
    if (!path || path[0] !== arrayFieldName) continue;
    const idx = path[1];
    const key = path[2];

    if (typeof idx !== 'number' || typeof key !== 'string') continue;

    if (!rows[idx]) rows[idx] = {};
    if (!rows[idx][key]) rows[idx][key] = [];
    rows[idx][key].push(issue.message);
  }
  return rows;
}

export function periodoATexto(periodo) {
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  if (!periodo) {
    return 'sin periodo';
  }
  const [y, m] = periodo.split('-').map(Number);

  const mes = meses[m - 1];
  const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1);

  return `${mesCap} ${y}`;
}

export const normalizarFecha = (fecha) => {
  const [y, m, d] = fecha.split('-').map(Number);
  const date = new Date(y, m - 1, d); // LOCAL (sin UTC)

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const normalizarPorcentaje = (numero) => {
  if (numero == null || isNaN(numero)) return '-';

  const value = numero * 100;

  return `${parseFloat(value.toFixed(2))} %`;
};

export const AgregarPorcentaje = (numero) => {
  const n = Number(numero);
  if (!Number.isFinite(n)) return null;

  return `${numero.toFixed(2)} %`;
};
