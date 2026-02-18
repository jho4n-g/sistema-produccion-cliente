// MedicamentosPdfButton.jsx
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function MedicamentosPdfButton({
  rows = [],
  columnas = [],
  meta,
  fileName = 'medicamentos.pdf',
  className = 'px-4 py-2 rounded bg-black text-white',
  children = 'Descargar PDF',
}) {
  const ref = useRef(null);

  const exportPDF = async () => {
    const el = ref.current;
    if (!el) return;

    const canvas = await html2canvas(el, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    // 📌 Carta vertical
    const pdf = new jsPDF('p', 'mm', 'letter');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  };

  return (
    <>
      <button onClick={exportPDF} className={className}>
        {children}
      </button>

      {/* Documento oculto para generar el PDF */}
      <div
        ref={ref}
        style={{
          width: '816px', // proporción aproximada carta vertical en px
          minHeight: '1056px',
          padding: '40px',
          background: '#fff',
          fontFamily: 'Arial',
          color: '#000',
          position: 'absolute',
          left: '-9999px',
          top: 0,
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
          <div style={{ fontWeight: 'bold' }}>{meta.caja}</div>
          <div style={{ textDecoration: 'underline' }}>{meta.regional}</div>

          <div style={{ height: 30 }} />

          <div style={{ fontWeight: 'bold', fontSize: 18 }}>{meta.titulo1}</div>

          <div style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>
            {meta.titulo2}
          </div>
        </div>

        <div style={{ height: 30 }} />

        {/* INFO SUPERIOR */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>Nro:</strong> {meta?.nro}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>{meta?.lugar},</strong> {meta.fecha}
          </div>

          <div>
            <strong>{meta?.año}</strong>
          </div>
        </div>

        <div style={{ height: 20 }} />

        {/* TABLA */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 10,
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Nro</th>
              {columnas.map((c) => (
                <th key={c.key} style={thStyle}>
                  {c.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, index) => (
              <tr key={index}>
                <td style={tdCenter}>{index + 1}</td>
                {columnas.map((c) => (
                  <td key={c.key} style={isNumeric(c.key) ? tdRight : td}>
                    {r?.[c.key] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const thStyle = {
  border: '1px solid #000',
  padding: '6px',
  background: '#e5e5e5',
  textAlign: 'center',
  fontWeight: 'bold',
};

const td = {
  border: '1px solid #000',
  padding: '4px',
};

const tdCenter = {
  ...td,
  textAlign: 'center',
};

const tdRight = {
  ...td,
  textAlign: 'right',
};

function isNumeric(key) {
  return ['cotcion', 'salida', 'saldo_actual', 'saldo_anterior'].includes(key);
}
