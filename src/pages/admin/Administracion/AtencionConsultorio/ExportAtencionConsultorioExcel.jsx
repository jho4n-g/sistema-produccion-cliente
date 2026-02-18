import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { normalizarFecha } from '@helpers/normalze.helpers';

const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const buildFileName = () =>
  `Atencion_Consultorio_${new Date().toISOString().slice(0, 10)}.xlsx`;

export async function exportAtencionConsultorioExcel({
  rows, // idealmente filtered (todo), no paginated
  cols, // tu const cols
  datosGrafico, // tu objeto con totales
}) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Sistema';
  wb.created = new Date();

  const ws = wb.addWorksheet('Atención Consultorio', {
    views: [{ state: 'frozen', xSplit: 1, ySplit: 2 }], // congela 1ra col + 2 filas (header)
  });

  // -------------------------
  // Columnas (header)
  // -------------------------
  const headerRow1 = [
    'DIA',
    ...cols.map((c) => c.label),
    'TOTAL CONSULTAS',
    'CONTROL P.A.',
    'GLICEMIA CAPILAR',
    'RIESGO PROF.',
    'RIESGO COMUN',
  ];

  // Fila 1: "DIA" + "PRESENTACIONES MEDICAS" merged + extras
  ws.addRow([]); // fila 1 (la llenamos con estilos/merge)
  ws.addRow(headerRow1); // fila 2 (header real)

  const totalCols = headerRow1.length;

  // Merge "PRESENTACIONES MEDICAS" (desde col 2 hasta col 1+cols.length)
  const startPM = 2;
  const endPM = 1 + cols.length;
  ws.mergeCells(1, startPM, 1, endPM);
  ws.getCell(1, startPM).value = 'PRESENTACIONES MEDICAS';

  // Columna 1 (DIA) también como título arriba (opcional)
  ws.getCell(1, 1).value = 'DIA';

  // Títulos de extras en fila 1 (para que quede parecido a tu tabla)
  ws.getCell(1, endPM + 1).value = 'TOTAL CONSULTAS';
  ws.getCell(1, endPM + 2).value = 'CONTROL P.A.';
  ws.getCell(1, endPM + 3).value = 'GLICEMIA CAPILAR';
  ws.getCell(1, endPM + 4).value = 'RIESGO PROF.';
  ws.getCell(1, endPM + 5).value = 'RIESGO COMUN';

  // -------------------------
  // Estilos header
  // -------------------------
  const styleHeaderBlue = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0369A1' } }, // sky-ish
    border: {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    },
  };

  const styleHeaderOrange = {
    font: { bold: true, color: { argb: 'FF1F2937' } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFED7AA' } }, // orange-200
    border: {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    },
  };

  // Fila 1 (títulos superiores)
  for (let c = 1; c <= totalCols; c++) {
    ws.getRow(1).getCell(c).style = styleHeaderBlue;
  }

  // Fila 2 (header: DIA naranja? y presentaciones naranja)
  ws.getRow(2).height = 42;
  // DIA header
  ws.getRow(2).getCell(1).style = styleHeaderBlue;

  // Presentaciones médicas (naranja)
  for (let c = 2; c <= endPM; c++)
    ws.getRow(2).getCell(c).style = styleHeaderOrange;

  // Extras (azul)
  for (let c = endPM + 1; c <= totalCols; c++)
    ws.getRow(2).getCell(c).style = styleHeaderBlue;

  // Alinear filas 1 y 2
  ws.getRow(1).height = 20;

  // AutoFilter sobre fila 2
  ws.autoFilter = {
    from: { row: 2, column: 1 },
    to: { row: 2, column: totalCols },
  };

  // Anchos
  ws.getColumn(1).width = 14; // DIA
  for (let c = 2; c <= totalCols; c++) ws.getColumn(c).width = 14;

  // -------------------------
  // Datos
  // -------------------------
  rows.forEach((r) => {
    ws.addRow([
      r.fecha ? normalizarFecha(r.fecha) : '',
      ...cols.map((c) => safeNum(r?.[c.key])),
      safeNum(r?.total_consultas),
      safeNum(r?.control_pa),
      safeNum(r?.glicemia_capilar),
      safeNum(r?.riesgo_prof),
      safeNum(r?.riesto_comun),
    ]);
  });

  // Estilo para celdas de datos
  const dataStartRow = 3; // porque 1 y 2 son header
  const dataEndRow = ws.rowCount;

  for (let r = dataStartRow; r <= dataEndRow; r++) {
    const row = ws.getRow(r);
    row.height = 18;

    for (let c = 1; c <= totalCols; c++) {
      const cell = row.getCell(c);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: c === 1 ? 'left' : 'right',
      };
      if (c !== 1) cell.numFmt = '#,##0'; // números
    }
  }

  // -------------------------
  // Totales (última fila)
  // -------------------------
  const totals = [
    'TOTAL',
    ...cols.map((c) => {
      const keyTotal = `total_${c.key.replace('prestacion_medica_', '')}`;
      return safeNum(datosGrafico?.[keyTotal]);
    }),
    safeNum(datosGrafico?.total_consultas_sum),
    safeNum(datosGrafico?.total_control_pa),
    safeNum(datosGrafico?.total_glicemia),
    safeNum(datosGrafico?.total_riesgo_prof),
    safeNum(datosGrafico?.total_riesgo),
  ];

  const totalsRow = ws.addRow(totals);
  totalsRow.height = 20;

  const styleTotalRed = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } }, // red-500
    border: {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    },
  };

  for (let c = 1; c <= totalCols; c++) {
    const cell = totalsRow.getCell(c);
    cell.style = styleTotalRed;
    if (c !== 1) {
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
      cell.numFmt = '#,##0';
    }
  }

  // -------------------------
  // Exportar
  // -------------------------
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, buildFileName());
}
