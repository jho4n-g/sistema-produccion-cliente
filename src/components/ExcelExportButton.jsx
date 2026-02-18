// ExcelExportButton.jsx
import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function ExcelExportButton({
  columns,
  data,
  fileName = 'inventario.xlsx',
  sheetName = 'Inventario',
  children = 'Descargar Excel',
  className,
}) {
  const handleExport = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(sheetName);

    // Definir columnas (headers)
    ws.columns = columns.map((c) => ({
      header: c.label,
      key: c.key,
      width: Math.max(12, String(c.label).length + 2),
    }));

    // Estilo header
    const headerRow = ws.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 18;

    // Agregar filas respetando el orden de columns
    data.forEach((row) => {
      const ordered = {};
      columns.forEach((c) => (ordered[c.key] = row?.[c.key] ?? ''));
      ws.addRow(ordered);
    });

    // Auto ancho (según contenido)
    ws.columns.forEach((col) => {
      let maxLen = col.header ? String(col.header).length : 10;
      col.eachCell?.({ includeEmpty: true }, (cell) => {
        const v = cell.value ?? '';
        maxLen = Math.max(maxLen, String(v).length);
      });
      col.width = Math.min(Math.max(12, maxLen + 2), 45);
    });

    // Formato / alineación para columnas numéricas conocidas
    const numericKeys = new Set([
      'cotcion',
      'salida',
      'saldo_actual',
      'saldo_anterior',
    ]);
    columns.forEach((c, idx) => {
      if (!numericKeys.has(c.key)) return;
      const excelCol = ws.getColumn(idx + 1);
      excelCol.numFmt = '#,##0.00';
      excelCol.alignment = { horizontal: 'right' };
    });

    // Congelar encabezado
    ws.views = [{ state: 'frozen', ySplit: 1 }];

    // Bordes básicos
    ws.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (rowNumber !== 1) cell.alignment = { vertical: 'middle' };
      });
    });

    // Descargar
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      fileName,
    );
  };

  return (
    <button type="button" onClick={handleExport} className={className}>
      {children}
    </button>
  );
}
