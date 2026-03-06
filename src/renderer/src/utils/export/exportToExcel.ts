import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// CONSTANTES DE ESTILO (extraídas del archivo original)
// ─────────────────────────────────────────────

const COLOR_HEADER_BG = 'FF002060'; // Azul oscuro – fondo cabecera de tabla
const COLOR_HEADER_FT = 'FFFFFFFF'; // Blanco – texto cabecera de tabla
const COLOR_TEXTO_OSC = 'FF000000'; // Negro – texto general

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
const FONT_CAMBRIA_11B: Partial<ExcelJS.Font> = {
  name: 'Cambria',
  size: 11,
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

// ─────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────

/**
 * Genera y descarga un archivo .xlsx con una hoja por cada elemento
 * de `hojas`, replicando exactamente el formato de Formato_Final.xlsx.
 *
 * @param hojas   Array de datos, uno por hoja
 * @param archivo Nombre del archivo a descargar (sin extensión)
 */
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

// ─────────────────────────────────────────────
// APLICAR TEMPLATE A UNA HOJA
// ─────────────────────────────────────────────

function aplicarTemplate(ws: ExcelJS.Worksheet, d: DatosHoja): void {
  // ── Anchos de columna (exactos del original) ──────────────────────────────
  ws.getColumn('A').width = 12.6 * 1.16;
  ws.getColumn('B').width = 14.2 * 1.16;
  ws.getColumn('C').width = 13.3 * 1.16;
  ws.getColumn('D').width = 9.1 * 1.16;
  ws.getColumn('E').width = 8.4 * 1.16;
  ws.getColumn('F').width = 24.0 * 1.16;
  ws.getColumn('G').width = 13.7 * 1.16;
  ws.getColumn('H').width = 13.9 * 1.16;
  ws.getColumn('I').width = 34.9 * 1.16;
  ws.getColumn('J').width = 7.1 * 1.16;
  ws.getColumn('K').width = 9.6 * 1.16;
  ws.getColumn('L').width = 15.1 * 1.16;

  // ── Altos de fila (exactos del original) ─────────────────────────────────
  ws.getRow(1).height = 15.6 * 1.25;
  ws.getRow(2).height = 15.6 * 1.25;
  ws.getRow(3).height = 15.6 * 1.25;
  ws.getRow(4).height = 41.4 * 1.25;
  ws.getRow(5).height = 39.6 * 1.25;
  for (let r = 6; r <= 22; r++) ws.getRow(r).height = 24.9 * 1.25;
  ws.getRow(22).height = 24.9 * 1.25;
  ws.getRow(23).height = 42.0 * 1.25;
  ws.getRow(24).height = 15.0 * 1.25;
  ws.getRow(25).height = 15.8 * 1.25;
  ws.getRow(26).height = 15.8 * 1.25;
  ws.getRow(27).height = 15.0 * 1.25;

  // ════════════════════════════════════════════
  // CABECERA (filas 1-4)
  // ════════════════════════════════════════════

  // Fila 1 – Título principal
  ws.mergeCells('A1:L1');
  const c1 = ws.getCell('A1');
  c1.value = 'DETALLE DE TRANSPORTE EXTERNO';
  c1.font = FONT_APTOS_12B;
  c1.alignment = { horizontal: 'center', wrapText: true };

  // Fila 2 – Nombre de referencia
  ws.mergeCells('A2:L2');
  const c2 = ws.getCell('A2');
  c2.value = d.nombreReferencia;
  c2.font = FONT_APTOS_12B;
  c2.alignment = { horizontal: 'center', wrapText: true };

  // Fila 3 – Mes | (libre) | Finca | Área
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

  // Fila 4 – Ruta del contrato
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

  // ════════════════════════════════════════════
  // CABECERA DE TABLA (fila 5)
  // ════════════════════════════════════════════

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

  // ════════════════════════════════════════════
  // FILAS DE DATOS (6-21)
  // ════════════════════════════════════════════

  const DATA_START = 6;
  const DATA_END = 21;
  const MAX_ROWS = DATA_END - DATA_START + 1; // 16

  for (let r = DATA_START; r <= DATA_END; r++) {
    const idx = r - DATA_START;
    const reg = d.registros[idx] as RegistroViaje | undefined;
    const dataCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

    // Columnas A-K: Cambria 9, borde thin, centrado
    for (const col of dataCols) {
      const cell = ws.getCell(`${col}${r}`);
      cell.font = FONT_CAMBRIA_9;
      cell.border = BORDER_THIN;
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }

    // Columna L: Aptos Narrow 11, borde thin, centrado
    const cellL = ws.getCell(`L${r}`);
    cellL.font = { name: 'Aptos Narrow', size: 11, bold: false, color: { argb: COLOR_TEXTO_OSC } };
    cellL.border = BORDER_THIN;
    cellL.alignment = { horizontal: 'center', vertical: 'middle' };

    if (reg) {
      ws.getCell(`A${r}`).value = reg.fechaEjecucion;
      ws.getCell(`B${r}`).value = reg.horaIngreso;
      ws.getCell(`C${r}`).value = reg.horaSalida;
      // Col D: fórmula tiempo de espera (igual que el original)
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

  // ════════════════════════════════════════════
  // FILA TOTAL (22)
  // ════════════════════════════════════════════

  ws.mergeCells('A22:I22');
  const cTotal = ws.getCell('A22');
  cTotal.value = 'Total';
  cTotal.font = FONT_CAMBRIA_9;
  cTotal.border = BORDER_THIN;
  cTotal.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  // Borde especial I22 – tiene right
  ws.getCell('I22').border = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // J22 – SUM de costos
  const cSum = ws.getCell('J22');
  cSum.value = { formula: '=SUM(J6:J21)' };
  cSum.font = FONT_CAMBRIA_9;
  cSum.border = BORDER_THIN;
  cSum.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  // K22, L22 – celdas vacías con borde
  for (const col of ['K', 'L']) {
    ws.getCell(`${col}22`).border = BORDER_THIN;
    ws.getCell(`${col}22`).font = FONT_CAMBRIA_9;
  }

  // ════════════════════════════════════════════
  // SECCIÓN DE FIRMAS (filas 23-28)
  // ════════════════════════════════════════════

  // Fila 23 – espacio vacío (alto 42 ya configurado)

  // Fila 24 – línea de firma proveedor
  ws.getCell('B24').value = '          _____________________________';
  ws.getCell('B24').font = FONT_APTOS_12;

  ws.mergeCells('J24:L24');
  ws.getCell('J24').alignment = { horizontal: 'center' };

  // Fila 25 – Proveedor del servicio / Gestionado por
  ws.mergeCells('A25:D25');
  const c25a = ws.getCell('A25');
  c25a.value = `                    ${d.proveedorServicio ?? 'Proveedor del servicio'}`;
  c25a.font = FONT_CAMBRIA_12B;
  c25a.alignment = { horizontal: 'center' };

  ws.mergeCells('G25:H25');
  const c25g = ws.getCell('G25');
  c25g.value = 'Gestionado por:';
  c25g.font = FONT_CAMBRIA_12B;
  c25g.border = BORDER_TOP_ONLY;
  c25g.alignment = { horizontal: 'left', wrapText: true };

  ws.getCell('H25').border = BORDER_TOP_ONLY;

  ws.mergeCells('J25:K25');
  ws.getCell('J25').alignment = { horizontal: 'center' };

  // Fila 26 – Nombre del gestor
  ws.mergeCells('B26:E26');
  ws.getCell('B26').alignment = { horizontal: 'center' };

  ws.getCell('G26').value = d.gestionadoPor ?? 'Nombre de Referencia';
  ws.getCell('G26').font = FONT_CAMBRIA_12B;

  ws.mergeCells('J26:K26');
  ws.getCell('J26').alignment = { horizontal: 'center' };

  // Fila 27 – Cargo del gestor
  ws.mergeCells('G27:H27');
  const c27g = ws.getCell('G27');
  c27g.value = d.cargoGestor ?? 'Jefe de Poscosecha';
  c27g.font = FONT_CAMBRIA_12B;
  c27g.alignment = { horizontal: 'left', wrapText: true };

  // Fila 28 – Cédula del gestor
  ws.getCell('G28').value = d.cedulaGestor ?? 'C.I. 0000000000';
  ws.getCell('G28').font = FONT_APTOS_11B;
  ws.getCell('G28').alignment = { horizontal: 'left' };
}
