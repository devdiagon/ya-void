import { ExportTripRow, ExportTripWorkSheet } from '@renderer/types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

export const exportTripsToExcel = async (
  workSheets: ExportTripWorkSheet[],
  file = 'Reporte_Transporte'
): Promise<void> => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Trip Registry';
  wb.created = new Date();

  for (const sheet of workSheets) {
    const ws = wb.addWorksheet(sheet.meta.workSheetName);
    applyFormat(ws, sheet);
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `${file}.xlsx`);
};

/// =========================================
/// HELPERS
/// =========================================

const DEFAULT_ROW_HEIGHT = 24.9 * 1.25;
const LINE_HEIGHT_PT = 14;

const estimateRowHeight = (
  texts: Array<{ text: string; colWidth: number; fontSize: number }>,
  defaultHeight = DEFAULT_ROW_HEIGHT
): number => {
  let maxLines = 1;

  for (const { text, colWidth, fontSize } of texts) {
    if (!text) continue;

    // Approximate characters per line based on column width
    // colWidth is in Excel units (~1 unit ≈ 1 char at 11pt)
    // Adjusted proportionally to font size used
    const charsPerLine = Math.max(1, Math.floor(colWidth * (11 / fontSize)));

    // Estimate explicit line breaks + wrap
    const segments = text.split(/\r?\n/);
    let lines = 0;
    for (const seg of segments) {
      lines += Math.ceil(seg.length / charsPerLine) || 1;
    }
    if (lines > maxLines) maxLines = lines;
  }

  if (maxLines <= 1) return defaultHeight;

  // Minimum Height: defaultHeight; scale proportionally if there are more line breaks
  return Math.max(defaultHeight, maxLines * LINE_HEIGHT_PT * 1.25);
};

/// =========================================
/// Style the Excel Sheet
/// =========================================

const applyFormat = (ws: ExcelJS.Worksheet, d: ExportTripWorkSheet): void => {
  // Print configuration
  ws.pageSetup = {
    paperSize: 9,
    orientation: 'landscape',
    scale: 70,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3
    }
  };

  // Set rows reference positions
  const DATA_START = 6;
  const DATA_END = DATA_START + d.rows.length - 1;
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

  // Total Row (set default heigh with scale factor)
  ws.getRow(TOTAL_ROW).height = 24.9 * CELL_HEIGHT_SF;

  // Post-table row spacing
  ws.getRow(POST_TABLE_SPACE_ROW).height = 42.0 * CELL_HEIGHT_SF;

  // Signature rows
  ws.getRow(SIG_LINE_ROW).height = 15.0 * CELL_HEIGHT_SF;
  ws.getRow(SIG_NAME_ROW).height = 15.8 * CELL_HEIGHT_SF;
  ws.getRow(SIG_EXTRA_ROW1).height = 15.8 * CELL_HEIGHT_SF;
  ws.getRow(SIG_EXTRA_ROW2).height = 15.0 * CELL_HEIGHT_SF;

  // ===================== HEADER (1-4 rows) ===================== \\

  // Row 1 – Title
  ws.mergeCells('A1:L1');
  const c1 = ws.getCell('A1');
  c1.value = 'DETALLE DE TRANSPORTE EXTERNO';
  c1.font = FONT_APTOS_12B;
  c1.alignment = { horizontal: 'center', wrapText: true };

  // Row 2 – Owner Name
  ws.mergeCells('A2:L2');
  const c2 = ws.getCell('A2');
  c2.value = 'Sr. LUIS ORLANDO HERNANDEZ QUISHPE';
  c2.font = FONT_APTOS_12B;
  c2.alignment = { horizontal: 'center', wrapText: true };

  // -------- Row 3 ----> Sections: (Month | Farm | Area)
  // Month label
  const c3a = ws.getCell('A3');
  c3a.value = 'MES';
  c3a.font = FONT_APTOS_12B;
  c3a.alignment = { horizontal: 'left' };

  // Month date detail
  ws.mergeCells('B3:F3');
  const c3b = ws.getCell('B3');
  c3b.value = `Del ${d.meta.startDate} al ${d.meta.endDate}`;
  c3b.font = FONT_APTOS_12B;
  c3b.alignment = { horizontal: 'left' };

  // Farm
  ws.getCell('G3').value = `Finca: ${d.meta.farmName}`;
  ws.getCell('G3').font = FONT_APTOS_12B;

  // Area label
  ws.getCell('J3').value = 'Área:';
  ws.getCell('J3').font = FONT_APTOS_12B;

  // Area detail
  ws.mergeCells('K3:L3');
  ws.getCell('K3').value = d.meta.areaName;
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

  ws.getCell('B4').value = 'Cayambe';
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
    const reg = d.rows[r - DATA_START] as ExportTripRow;
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

    // Fill data values in the row
    ws.getCell(`A${r}`).value = reg.tripDate;
    ws.getCell(`B${r}`).value = reg.departureTime;
    ws.getCell(`C${r}`).value = reg.arrivalTime;
    ws.getCell(`D${r}`).value = reg.waitingTime;
    ws.getCell(`E${r}`).value = reg.passengerCount;
    ws.getCell(`F${r}`).value = reg.reason;
    ws.getCell(`G${r}`).value = reg.requester.name;
    ws.getCell(`H${r}`).value = reg.requester.area;
    ws.getCell(`I${r}`).value = reg.route;
    ws.getCell(`J${r}`).value = reg.cost;
    ws.getCell(`K${r}`).value = reg.vehicleType;

    // Set row height based on the longest text that could be in the rows (F-I)
    ws.getRow(r).height = estimateRowHeight([
      { text: reg.reason, colWidth: 24.0, fontSize: 9 },
      { text: reg.requester.name, colWidth: 13.7, fontSize: 9 },
      { text: reg.requester.area, colWidth: 13.9, fontSize: 9 },
      { text: reg.route, colWidth: 34.9, fontSize: 9 }
    ]);
  }

  // ===================== TOTAL ===================== \\

  const totalMergeCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  for (const col of totalMergeCols) {
    const borderDef: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      bottom: { style: 'thin' }
    };
    if (col === 'A') borderDef.left = { style: 'thin' };
    if (col === 'I') borderDef.right = { style: 'thin' };
    ws.getCell(`${col}${TOTAL_ROW}`).border = borderDef;
  }

  ws.mergeCells(`A${TOTAL_ROW}:I${TOTAL_ROW}`);
  const cTotal = ws.getCell(`A${TOTAL_ROW}`);
  cTotal.value = 'Total';
  cTotal.font = FONT_CAMBRIA_9;
  cTotal.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

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
  c25a.value = `                    Transportes Andes S.A.`;
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

  ws.getCell(`G${SIG_EXTRA_ROW1}`).value = d.manager.name;
  ws.getCell(`G${SIG_EXTRA_ROW1}`).font = FONT_CAMBRIA_12B;

  ws.mergeCells(`J${SIG_EXTRA_ROW1}:K${SIG_EXTRA_ROW1}`);
  ws.getCell(`J${SIG_EXTRA_ROW1}`).alignment = { horizontal: 'center' };

  // Row 2
  ws.mergeCells(`G${SIG_EXTRA_ROW2}:H${SIG_EXTRA_ROW2}`);
  const c27g = ws.getCell(`G${SIG_EXTRA_ROW2}`);
  c27g.value = `Jefe de ${d.meta.areaName}`;
  c27g.font = FONT_CAMBRIA_12B;
  c27g.alignment = { horizontal: 'left', wrapText: true };

  // Row 3
  ws.getCell(`G${SIG_EXTRA_ROW3}`).value = `C.I. ${d.manager.ci}`;
  ws.getCell(`G${SIG_EXTRA_ROW3}`).font = FONT_APTOS_11B;
  ws.getCell(`G${SIG_EXTRA_ROW3}`).alignment = { horizontal: 'left' };
};
