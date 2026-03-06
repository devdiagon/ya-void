import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface RegistroViaje {
  fechaEjecucion: string; // Col A  – "DD/MM/YYYY"
  horaIngreso: string; // Col B  – "HH:MM" (se calcula D automáticamente)
  horaSalida: string; // Col C  – "HH:MM"
  personas: number; // Col E
  motivoContratacion: string; // Col F
  personaSolicita: string; // Col G
  areaTraslado: string; // Col H
  rutaEjecutada: string; // Col I
  costo: number; // Col J
  tipoTransporte: string; // Col K
  firmaUsuario?: string; // Col L  – opcional (texto / iniciales)
}

export interface DatosHoja {
  /** Nombre de la pestaña en el libro Excel */
  nombreHoja: string;
  /** Nombre del responsable – fila 2 */
  nombreReferencia: string;
  /** Texto completo de la fila 3 izq. Ej: "MES  Del 01 al 07 de Abril del 2026." */
  mes: string;
  /** Finca – fila 3 centro. Ej: "Finca: R2" */
  finca: string;
  /** Área – fila 3 der. Ej: "Empaque" */
  area: string;
  /** Ruta del contrato – fila 4 */
  rutaContrato: string;
  /** Registros de viajes (máx. 16 filas, rows 6-21) */
  registros: RegistroViaje[];
  /** Nombre del proveedor del servicio – sección de firmas */
  proveedorServicio?: string;
  /** Nombre de quien gestiona – sección de firmas */
  gestionadoPor?: string;
  /** Cargo del gestor */
  cargoGestor?: string;
  /** Cédula del gestor */
  cedulaGestor?: string;
}

/// =========================================
/// Constants
/// =========================================

const COLOR_HEADER_BG = 'FF002060';
const COLOR_HEADER_FT = 'FFFFFFFF';
const COLOR_TEXTO_OSC = 'FF000000';

const FONT_APTOS_12B: Partial<ExcelJS.Font> = {
  name: 'Aptos Narrow',
  size: 12,
  bold: true,
  color: { argb: COLOR_TEXTO_OSC }
};
const FONT_APTOS_11B: Partial<ExcelJS.Font> = {
  name: 'Aptos Narrow',
  size: 11,
  bold: true,
  color: { argb: COLOR_TEXTO_OSC }
};
const FONT_APTOS_12: Partial<ExcelJS.Font> = {
  name: 'Aptos Narrow',
  size: 12,
  bold: false,
  color: { argb: COLOR_TEXTO_OSC }
};
const FONT_CAMBRIA_10B: Partial<ExcelJS.Font> = {
  name: 'Cambria',
  size: 10,
  bold: true,
  color: { argb: COLOR_HEADER_FT }
};
const FONT_CAMBRIA_9: Partial<ExcelJS.Font> = {
  name: 'Cambria',
  size: 9,
  bold: false,
  color: { argb: COLOR_TEXTO_OSC }
};
const FONT_CAMBRIA_12B: Partial<ExcelJS.Font> = {
  name: 'Cambria',
  size: 12,
  bold: true,
  color: { argb: COLOR_TEXTO_OSC }
};

const FILL_HEADER: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: COLOR_HEADER_BG }
};

const BORDER_THIN: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  bottom: { style: 'thin' },
  left: { style: 'thin' },
  right: { style: 'thin' }
};

const BORDER_TOP_ONLY: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' }
};

const CELL_WIDTH_SF = 1.16;
const CELL_HEIGHT_SF = 1.25;

/// =========================================
/// Main export function
/// =========================================

export async function exportarViajes(
  hojas: DatosHoja[],
  archivo = 'Reporte_Transporte'
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Sistema de Viajes';
  wb.created = new Date();

  for (const datos of hojas) {
    const ws = wb.addWorksheet(datos.nombreHoja);
    aplicarTemplate(ws, datos);
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `${archivo}.xlsx`);
}

/// =========================================
/// Style the Excel Sheet
/// =========================================

function aplicarTemplate(ws: ExcelJS.Worksheet, d: DatosHoja): void {
  // Set rows reference positions
  const DATA_START = 6;
  const DATA_END = DATA_START + d.registros.length - 1;
  const TOTAL_ROW = DATA_END + 1;
  const POST_TABLE_SPACE_ROW = TOTAL_ROW + 1;
  const SIG_LINE_ROW = POST_TABLE_SPACE_ROW + 1;
  const SIG_NAME_ROW = SIG_LINE_ROW + 1;
  const SIG_EXTRA_ROW1 = SIG_NAME_ROW + 1;
  const SIG_EXTRA_ROW2 = SIG_EXTRA_ROW1 + 1;
  const SIG_EXTRA_ROW3 = SIG_EXTRA_ROW2 + 1;

  // A-L columns (following the original format) using a scale factor
  ws.getColumn('A').width = 12.6 * CELL_WIDTH_SF;
  ws.getColumn('B').width = 14.2 * CELL_WIDTH_SF;
  ws.getColumn('C').width = 13.3 * CELL_WIDTH_SF;
  ws.getColumn('D').width = 9.1 * CELL_WIDTH_SF;
  ws.getColumn('E').width = 8.4 * CELL_WIDTH_SF;
  ws.getColumn('F').width = 24.0 * CELL_WIDTH_SF;
  ws.getColumn('G').width = 13.7 * CELL_WIDTH_SF;
  ws.getColumn('H').width = 13.9 * CELL_WIDTH_SF;
  ws.getColumn('I').width = 34.9 * CELL_WIDTH_SF;
  ws.getColumn('J').width = 7.1 * CELL_WIDTH_SF;
  ws.getColumn('K').width = 9.6 * CELL_WIDTH_SF;
  ws.getColumn('L').width = 15.1 * CELL_WIDTH_SF;

  // Header rows & table header rows (following the original format) using a scale factor
  ws.getRow(1).height = 15.6 * CELL_HEIGHT_SF;
  ws.getRow(2).height = 15.6 * CELL_HEIGHT_SF;
  ws.getRow(3).height = 15.6 * CELL_HEIGHT_SF;
  ws.getRow(4).height = 41.4 * CELL_HEIGHT_SF;
  ws.getRow(5).height = 39.6 * CELL_HEIGHT_SF;

  // Data Rows + Total Row (set default heigh with scale factor for now)
  for (let r = DATA_START; r <= TOTAL_ROW; r++) ws.getRow(r).height = 24.9 * CELL_HEIGHT_SF;

  // Post-table row spacing
  ws.getRow(POST_TABLE_SPACE_ROW).height = 42.0 * CELL_HEIGHT_SF;

  // Signature rows
  ws.getRow(SIG_LINE_ROW).height = 15.0 * CELL_HEIGHT_SF;
  ws.getRow(SIG_NAME_ROW).height = 15.8 * CELL_HEIGHT_SF;
  ws.getRow(SIG_EXTRA_ROW1).height = 15.8 * CELL_HEIGHT_SF;
  ws.getRow(SIG_EXTRA_ROW2).height = 15.0 * CELL_HEIGHT_SF;

  // ===================== HEADER (1-4 rows) ===================== \\

  // Row 1 – Ttile
  ws.mergeCells('A1:L1');
  const c1 = ws.getCell('A1');
  c1.value = 'DETALLE DE TRANSPORTE EXTERNO';
  c1.font = FONT_APTOS_12B;
  c1.alignment = { horizontal: 'center', wrapText: true };

  // Row 2 – Owner Name
  ws.mergeCells('A2:L2');
  const c2 = ws.getCell('A2');
  c2.value = d.nombreReferencia;
  c2.font = FONT_APTOS_12B;
  c2.alignment = { horizontal: 'center', wrapText: true };

  // Row 3 – Month | Farm | Area
  ws.mergeCells('A3:D3');
  const c3a = ws.getCell('A3');
  c3a.value = d.mes;
  c3a.font = FONT_APTOS_12B;
  c3a.alignment = { horizontal: 'left' };

  ws.getCell('G3').value = d.finca;
  ws.getCell('G3').font = FONT_APTOS_12B;

  ws.getCell('J3').value = 'Área:';
  ws.getCell('J3').font = FONT_APTOS_12B;

  ws.mergeCells('K3:L3');
  ws.getCell('K3').value = d.area;
  ws.getCell('K3').font = FONT_APTOS_12B;
  ws.getCell('K3').alignment = { horizontal: 'left' };

  // Row 4 – Contract route
  ws.getCell('A4').value = 'Ruta que consta en el Contrato:';
  ws.getCell('A4').font = {
    name: 'Aptos Narrow',
    size: 11,
    bold: true,
    color: { argb: COLOR_TEXTO_OSC }
  };
  ws.getCell('A4').alignment = { horizontal: 'left', wrapText: true };

  ws.getCell('B4').value = d.rutaContrato;
  ws.getCell('B4').font = {
    name: 'Aptos Narrow',
    size: 11,
    bold: false,
    color: { argb: COLOR_TEXTO_OSC }
  };
  ws.getCell('B4').alignment = { horizontal: 'left', vertical: 'middle' };

  // ===================== TABLE HEADER (5th row) ===================== \\

  const headers: [string, string][] = [
    ['A5', 'Fecha de Ejecución del Transporte'],
    ['B5', 'Hora de ingreso a finca (transportista)'],
    ['C5', 'Hora de salida de la Finca (transportista)'],
    ['D5', 'Tiempo de espera'],
    ['E5', '# Personas'],
    ['F5', 'Motivo de contratación de la ruta extra'],
    ['G5', 'Persona que solicita la ruta extra'],
    ['H5', 'Área de trabajo del solicitante'],
    ['I5', 'Ruta extra ejecutada (desde-hasta) especificar si la ruta es de ida y vuelta'],
    ['J5', 'Costo'],
    ['K5', 'Tipo de transporte'],
    ['L5', 'Firma Usuario Solicitante']
  ];

  for (const [addr, texto] of headers) {
    const cell = ws.getCell(addr);
    cell.value = texto;
    cell.font = FONT_CAMBRIA_10B;
    cell.fill = FILL_HEADER;
    cell.border = BORDER_THIN;
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  }

  // ===================== DATA ROWS ===================== \\

  for (let r = DATA_START; r <= DATA_END; r++) {
    const reg = d.registros[r - DATA_START] as RegistroViaje | undefined;
    const dataCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

    // Cols A-K: Cambria 9, thin border, centered
    for (const col of dataCols) {
      const cell = ws.getCell(`${col}${r}`);
      cell.font = FONT_CAMBRIA_9;
      cell.border = BORDER_THIN;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }

    // Col L: Aptos Narrow 11, thin border, centered
    const cellL = ws.getCell(`L${r}`);
    cellL.font = { name: 'Aptos Narrow', size: 11, bold: false, color: { argb: COLOR_TEXTO_OSC } };
    cellL.border = BORDER_THIN;
    cellL.alignment = { horizontal: 'center', vertical: 'middle' };

    if (reg) {
      ws.getCell(`A${r}`).value = reg.fechaEjecucion;
      ws.getCell(`B${r}`).value = reg.horaIngreso;
      ws.getCell(`C${r}`).value = reg.horaSalida;
      ws.getCell(`D${r}`).value = { formula: `=C${r}-B${r}` };
      ws.getCell(`E${r}`).value = reg.personas;
      ws.getCell(`F${r}`).value = reg.motivoContratacion;
      ws.getCell(`G${r}`).value = reg.personaSolicita;
      ws.getCell(`H${r}`).value = reg.areaTraslado;
      ws.getCell(`I${r}`).value = reg.rutaEjecutada;
      ws.getCell(`J${r}`).value = reg.costo;
      ws.getCell(`K${r}`).value = reg.tipoTransporte;
      if (reg.firmaUsuario) ws.getCell(`L${r}`).value = reg.firmaUsuario;
    }
  }

  // ===================== TOTAL ===================== \\

  ws.mergeCells(`A${TOTAL_ROW}:I${TOTAL_ROW}`);
  const cTotal = ws.getCell(`A${TOTAL_ROW}`);
  cTotal.value = 'Total';
  cTotal.font = FONT_CAMBRIA_9;
  cTotal.border = BORDER_THIN;
  cTotal.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  // Col I with right border
  ws.getCell(`I${TOTAL_ROW}`).border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Col J – SUM formula
  const cSum = ws.getCell(`J${TOTAL_ROW}`);
  cSum.value = { formula: `=SUM(J${DATA_START}:J${DATA_END})` };
  cSum.font = FONT_CAMBRIA_9;
  cSum.border = BORDER_THIN;
  cSum.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  // Cols K, L – empty cells with border
  for (const col of ['K', 'L']) {
    ws.getCell(`${col}${TOTAL_ROW}`).border = BORDER_THIN;
    ws.getCell(`${col}${TOTAL_ROW}`).font = FONT_CAMBRIA_9;
  }

  // ===================== SIGNATURES ===================== \\

  // POST_TABLE_SPACE_ROW cells already configured (empty space after the table)

  // Signature line
  ws.getCell(`B${SIG_LINE_ROW}`).value = '          _____________________________';
  ws.getCell(`B${SIG_LINE_ROW}`).font = FONT_APTOS_12;

  ws.mergeCells(`J${SIG_LINE_ROW}:L${SIG_LINE_ROW}`);
  ws.getCell(`J${SIG_LINE_ROW}`).alignment = { horizontal: 'center' };

  // Text below the signature line
  ws.mergeCells(`A${SIG_NAME_ROW}:D${SIG_NAME_ROW}`);
  const c25a = ws.getCell(`A${SIG_NAME_ROW}`);
  c25a.value = `                    ${d.proveedorServicio ?? 'Proveedor del servicio'}`;
  c25a.font = FONT_CAMBRIA_12B;
  c25a.alignment = { horizontal: 'center' };

  ws.mergeCells(`G${SIG_NAME_ROW}:H${SIG_NAME_ROW}`);
  const c25g = ws.getCell(`G${SIG_NAME_ROW}`);
  c25g.value = 'Gestionado por:';
  c25g.font = FONT_CAMBRIA_12B;
  c25g.border = BORDER_TOP_ONLY;
  c25g.alignment = { horizontal: 'left', wrapText: true };

  ws.getCell(`H${SIG_NAME_ROW}`).border = BORDER_TOP_ONLY;

  ws.mergeCells(`J${SIG_NAME_ROW}:K${SIG_NAME_ROW}`);
  ws.getCell(`J${SIG_NAME_ROW}`).alignment = { horizontal: 'center' };

  // Second signature related text fields (Gestor)
  // Row 1
  ws.mergeCells(`B${SIG_EXTRA_ROW1}:E${SIG_EXTRA_ROW1}`);
  ws.getCell(`B${SIG_EXTRA_ROW1}`).alignment = { horizontal: 'center' };

  ws.getCell(`G${SIG_EXTRA_ROW1}`).value = d.gestionadoPor ?? 'Nombre de Referencia';
  ws.getCell(`G${SIG_EXTRA_ROW1}`).font = FONT_CAMBRIA_12B;

  ws.mergeCells(`J${SIG_EXTRA_ROW1}:K${SIG_EXTRA_ROW1}`);
  ws.getCell(`J${SIG_EXTRA_ROW1}`).alignment = { horizontal: 'center' };

  // Row 2
  ws.mergeCells(`G${SIG_EXTRA_ROW2}:H${SIG_EXTRA_ROW2}`);
  const c27g = ws.getCell(`G${SIG_EXTRA_ROW2}`);
  c27g.value = d.cargoGestor ?? 'Jefe de Poscosecha';
  c27g.font = FONT_CAMBRIA_12B;
  c27g.alignment = { horizontal: 'left', wrapText: true };

  // Row 3
  ws.getCell(`G${SIG_EXTRA_ROW3}`).value = d.cedulaGestor ?? 'C.I. 0000000000';
  ws.getCell(`G${SIG_EXTRA_ROW3}`).font = FONT_APTOS_11B;
  ws.getCell(`G${SIG_EXTRA_ROW3}`).alignment = { horizontal: 'left' };
}
