// InformeMensual3HojasPdfButton.jsx
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import LogoCeramicaCoboce from '../img/logo-ceramica-coboce.png';

export default function InformeMensual3HojasPdfButton({
  fileName = 'informe-mensual.pdf',
  className = 'px-4 py-2 rounded bg-black text-white',
  children = 'Descargar PDF',
  // datos que uses
  dataPage1,
  dataPage2,
  dataPage3,
  doctor = 'DRA. GREYSI VIVIANA GARCÍA ÁLVAREZ',
  mes = 'Septiembre',
  año = '2025',
}) {
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);

  const capturePage = async (el) => {
    const canvas = await html2canvas(el, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    return canvas.toDataURL('image/png');
  };

  const exportPDF = async () => {
    const p1 = page1Ref.current;
    const p2 = page2Ref.current;
    const p3 = page3Ref.current;
    if (!p1 || !p2 || !p3) return;

    const pdf = new jsPDF('p', 'mm', 'letter'); // ✅ Carta vertical
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // --- Page 1 ---
    const img1 = await capturePage(p1);
    pdf.addImage(img1, 'PNG', 0, 0, pageWidth, pageHeight);

    // --- Page 2 ---
    pdf.addPage('letter', 'p');
    const img2 = await capturePage(p2);
    pdf.addImage(img2, 'PNG', 0, 0, pageWidth, pageHeight);

    // --- Page 3 ---
    pdf.addPage('letter', 'p');
    const img3 = await capturePage(p3);
    pdf.addImage(img3, 'PNG', 0, 0, pageWidth, pageHeight);

    pdf.save(fileName);
  };

  return (
    <>
      <button type="button" onClick={exportPDF} className={className}>
        {children}
      </button>

      {/* Render oculto de las 3 hojas (cada una tamaño carta) */}
      <div style={hiddenWrap}>
        <div ref={page1Ref} style={pageStyle}>
          <Page1 data={dataPage1} doctor={doctor} año={año} mes={mes} />
        </div>

        <div ref={page2Ref} style={pageStyle}>
          <Page2 data={dataPage2} doctor={doctor} />
        </div>

        <div ref={page3Ref} style={pageStyle}>
          <Page3 data={dataPage3} doctor={doctor} />
        </div>
      </div>
    </>
  );
}

const columnasPrestaciones = [
  'ALERGIAS',
  'CARDIOVASCULAR',
  'CEFALEAS',
  'OFTALMOLOGICAS',
  'OTICAS',
  'RESPIRATORIA',
  'DIGESTIVA',
  'GENITOURINARIAS',
  'MUSCULO ESQUELETICAS',
  'ODONTALGIA',
  'QUEMADURAS',
  'PIEL Y ANEXOS',
  'OTROS',
  'CURACIONES',
  'INYECTABLES',
];

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 9,
  },
  th: {
    border: '1px solid #000',
    textAlign: 'center',
    padding: 2,
    fontWeight: 800,
    verticalAlign: 'middle',
  },
  td: {
    border: '1px solid #000',
    textAlign: 'center',
    padding: 2,
    height: 16,
  },
  // Encabezado grupo
  grupo: {
    background: '#7fa2c8',
    height: 26,
    fontSize: 11,
  },

  thVerticalCell: {
    width: 22, // ajusta según tu imagen (18-26)
    height: 140, // alto del header (120-150)
    padding: 0,
    position: 'relative',
    verticalAlign: 'middle',
    overflow: 'hidden',
  },

  thVerticalText: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%) rotate(-90deg)', // como Excel
    transformOrigin: 'center',
    whiteSpace: 'nowrap',
    fontSize: 10,
    lineHeight: 1,
  },
  // Vertical headers
  vertical: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    height: 120,
    width: 18,
    padding: '6px 2px',
  },

  // Día
  diaHeader: {
    background: '#7fa2c8',
    width: 28,
  },
  diaCell: {
    background: '#7fa2c8',
    fontWeight: 800,
  },
  thNumero: {
    background: '#7fa2c8',
    fontSize: 20,
    fontWeight: 300,
    textAlign: 'center',
    verticalAlign: 'middle',
  },

  // Colores columnas
  prestaciones: { background: '#e4c29f' },
  verde: { background: '#cfe3b4', fontWeight: 800 },
  gris: { background: '#e0e0e0' },
  rojo: { background: '#f4a3a3' },
};
const hiddenWrap = {
  position: 'absolute',
  left: '-99999px',
  top: 0,
  background: '#fff',
};

const pageStyle = {
  width: '816px', // aprox carta en px (para render)
  height: '1056px',
  padding: '18px',
  boxSizing: 'border-box',
  background: '#fff',
  fontFamily: 'Arial',
  color: '#000',
};

/* =========================
   AQUÍ ARMAS CADA HOJA
   ========================= */

function Header({ doctor = 'DRA. GREYSI VIVIANA GARCÍA ÁLVAREZ' }) {
  // ⚠️ ideal: logos importados localmente (no URL) para evitar CORS
  return (
    <div
      style={{
        border: '2px solid #000',
        padding: 8,
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          border: '1px solid #000',
          padding: 8,
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {doctor}
      </div>
      <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 13 }}>
        INFORME MENSUAL DE
        <br />
        ACTIVIDADES SEPTIEMBRE 2025
      </div>
      <div
        style={{
          border: '1px solid #000',
          padding: 8,
          fontSize: 10,
          textAlign: 'right',
        }}
      >
        <img
          src={LogoCeramicaCoboce}
          alt="Coboce"
          className="h-15 w-44 object-contain"
        />
      </div>
    </div>
  );
}

function SectionBar({ text }) {
  return (
    <div
      style={{
        marginTop: 10,
        background: '#d9d9d9',
        border: '1px solid #000',
        padding: '6px 8px',
        fontWeight: 800,
        fontSize: 11,
      }}
    >
      {text}
    </div>
  );
}

/** HOJA 1: (la primera imagen que ya tenías) */
function Page1({ data, doctor, mes = 'Sin mes12', año = 'Sin año12' }) {
  return (
    <div>
      <Header doctor={doctor} />
      <SectionBar text="1. RESUMEN GENERAL DEL MES" />
      <div
        style={{
          border: '1px solid #000',
          padding: 10,
          fontSize: 11,
          lineHeight: 1.35,
        }}
      >
        Durante el mes de SEPTIEMBRE se brindó atención en medicina general al
        personal administrativo y operativo implicado en el proceso de
        fabricación y comercialización de cerámica atendiendo de forma oportuna
        en curaciones menores, malestares generales y emergencias. Así mismo se
        realizaron salidas programadas a control y reposición de botiquines; y
        atención médica al personal de las agencias de comercialización de
        Cochabamba.
      </div>

      <SectionBar text="2. ATENCIÓN MÉDICA DIARIA" />
      <div
        style={{
          border: '1px solid #000',
          padding: 10,
          fontSize: 11,
          lineHeight: 1.35,
        }}
      >
        A continuación, se presenta el cuadro resumen que detalla el número de
        consultas atendidas de manera diaria y las prestaciones de servicios
        médicos a la que corresponde; además de un reporte breve de incidentes y
        accidentes ocurridos durante el mes.
        <tr />
      </div>

      {/* aquí la tabla grande de días */}
      <div
        style={{
          marginTop: 10,
          textAlign: 'center',
          fontWeight: 800,
          marginBottom: '10px',
        }}
      >
        REPORTE DIARIO DE ATENCIÓN MÉDICA
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40, // <-- espacio entre Mes y Año
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          <span>Mes: {mes}</span>
          <span>Año: {año}</span>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          {/* Fila 1 (grupo superior) */}
          <tr>
            <th style={{ ...styles.th, ...styles.diaHeader }} rowSpan={2}>
              DÍA
            </th>

            <th
              style={{ ...styles.th, ...styles.grupo }}
              colSpan={columnasPrestaciones.length}
            >
              PRESTACIONES MÉDICAS
            </th>

            <th
              style={{
                ...styles.th,
                ...styles.thVerticalCell,
                ...styles.verde,
              }}
              rowSpan={2}
            >
              <div style={styles.thVerticalText}>TOTAL CONSULTAS</div>
            </th>

            <th
              style={{ ...styles.th, ...styles.thVerticalCell, ...styles.gris }}
              rowSpan={2}
            >
              <div style={styles.thVerticalText}>CONTROL P.A.</div>
            </th>

            <th
              style={{ ...styles.th, ...styles.thVerticalCell, ...styles.gris }}
              rowSpan={2}
            >
              <div style={styles.thVerticalText}>GLICEMIA CAPILAR</div>
            </th>

            <th
              style={{ ...styles.th, ...styles.thVerticalCell, ...styles.rojo }}
              rowSpan={2}
            >
              <div style={styles.thVerticalText}>RIESGO PROF.</div>
            </th>

            <th
              style={{ ...styles.th, ...styles.thVerticalCell, ...styles.rojo }}
              rowSpan={2}
            >
              <div style={styles.thVerticalText}>RIESGO COMÚN</div>
            </th>
          </tr>

          <tr>
            {columnasPrestaciones.map((col) => (
              <th
                key={col}
                style={{
                  ...styles.th,
                  ...styles.thVerticalCell,
                  ...styles.prestaciones,
                }}
              >
                <div style={styles.thVerticalText}>{col}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...styles.td, ...styles.thNumero }}>1</td>
            {columnasPrestaciones.map((col) => (
              <td key={col} style={styles.td}>
                1
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {/* tabla... */}

      {/* tabla... */}
      <Footer />
    </div>
  );
}

/** HOJA 2: (la imagen con gráficos) */
function Page2({ data, doctor }) {
  return (
    <div>
      <Header doctor={doctor} />
      <div style={{ marginTop: 16, textAlign: 'center', fontWeight: 800 }}>
        PRESTACIONES MÉDICAS
      </div>
      A continuación, se presenta el cuadro resumen que detalla el número de
      consultas atendidas de manera diaria y las prestaciones de servicios
      médicos a la que corresponde; además de un reporte breve de incidentes y
      accidentes ocurridos durante el mes.
      {/* ✅ Aquí insertas tus gráficos como imágenes (recomendado)
          - si los gráficos están en tu UI (chart.js, echarts), los capturas con html2canvas igual
          - o los exportas a base64 (mejor)
      */}
      <div
        style={{
          marginTop: 10,
          border: '1px solid #ccc',
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        (GRÁFICO TORTA AQUÍ)
      </div>
      <div
        style={{
          marginTop: 12,
          border: '1px solid #ccc',
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        (GRÁFICO BARRAS AQUÍ)
      </div>
      <SectionBar text="3. REVISIÓN DE BOTIQUINES" />
      <div
        style={{
          border: '1px solid #000',
          padding: 10,
          fontSize: 11,
          lineHeight: 1.35,
        }}
      >
        Se realizaron salidas programadas para la inspección y control de
        botiquines de primeros auxilios, tanto en la planta central como en las
        agencias de comercialización. Durante estas visitas se verificó el
        estado de los insumos médicos, fechas de vencimiento de los
        medicamentos, condiciones de almacenamiento y reposición en los casos
        necesarios
      </div>
      <Footer />
    </div>
  );
}

/** HOJA 3: (control medicamentos e insumos) */
function Page3({ data, doctor }) {
  return (
    <div>
      <Header doctor={doctor} />
      <div
        style={{
          marginTop: 12,
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 12,
        }}
      >
        CONTROL MEDICAMENTOS
        <br />E INSUMOS DE BOTIQUÍN
      </div>
      <div style={{ marginTop: 6, textAlign: 'center', fontSize: 10 }}>
        MES: Septiembre &nbsp;&nbsp; AÑO: 2025
      </div>

      {/* tabla control */}
      <div style={{ marginTop: 10 }}>
        {/* aquí tu tabla con bordes (igual a la imagen) */}
      </div>
      {/* firma */}
      <div style={{ marginTop: 40, textAlign: 'center', fontSize: 11 }}>
        <div style={{ fontWeight: 700 }}>Dra. Greisy V. García Álvarez</div>
        <div style={{ fontWeight: 700 }}>MÉDICO GENERAL</div>
        <div style={{ fontWeight: 700 }}>M.P: G - 6489503</div>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 10,
        fontSize: 9,
        textAlign: 'center',
        borderTop: '1px solid #000',
        paddingTop: 4,
      }}
    >
      Av. Barrientos N° 658 Km 11 Acera Norte (Carretera Sacaba)
    </div>
  );
}
