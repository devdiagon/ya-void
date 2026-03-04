import { ExportTripWorkSheet } from '@renderer/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HFONT = 'helvetica';

export const exportTripsToPDF = (data: ExportTripWorkSheet) => {
  const doc = new jsPDF({ orientation: 'landscape' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;
  const rightX = pageWidth - marginX;

  // ============== ENCABEZADO ============== \\
  doc.setFont(HFONT, 'bold');
  doc.setFontSize(12);
  doc.text('DETALLE DE TRANSPORTE EXTERNO', pageWidth / 2, 14, { align: 'center' });
  doc.text('SR. LUIS PEREZ', pageWidth / 2, 20, { align: 'center' });

  const fila3Y = 26;

  // Rango Fecha
  doc.setFont(HFONT, 'bold');
  doc.text('MES: ', marginX, fila3Y);
  const mesLabelWidth = doc.getTextWidth('MES: ');
  doc.setFont(HFONT, 'normal');
  doc.text(`Del ${data.meta.startDate} al ${data.meta.endDate}`, marginX + mesLabelWidth, fila3Y);

  // Finca
  const fincaLabel = 'Finca: ';
  const fincaValue = data.meta.farmName;
  const fincaFullWidth = doc.getTextWidth(fincaLabel) + doc.getTextWidth(fincaValue);
  const fincaStartX = pageWidth / 2 - fincaFullWidth / 2;
  doc.setFont(HFONT, 'bold');
  doc.text(fincaLabel, fincaStartX, fila3Y);
  doc.setFont(HFONT, 'normal');
  doc.text(fincaValue, fincaStartX + doc.getTextWidth(fincaLabel), fila3Y);

  // Área
  const areaLabel = 'Área: ';
  const areaValue = data.meta.areaName;
  const areaFullWidth = doc.getTextWidth(areaLabel) + doc.getTextWidth(areaValue);
  doc.setFont(HFONT, 'bold');
  doc.text(areaLabel, rightX - areaFullWidth, fila3Y);
  doc.setFont(HFONT, 'normal');
  doc.text(areaValue, rightX - areaFullWidth + doc.getTextWidth(areaLabel), fila3Y);

  // Sector
  const fila4FontSize = 11;
  doc.setFontSize(fila4FontSize);
  const lineHeight = fila4FontSize * 0.45;

  const rutaLines = ['Ruta que', 'consta en el', 'Contrato:'];
  const labelStartY = 32;

  doc.setFont(HFONT, 'bold');
  rutaLines.forEach((line, i) => {
    doc.text(line, marginX, labelStartY + i * lineHeight);
  });

  const labelBlockHeight = (rutaLines.length - 1) * lineHeight;
  const valueY = labelStartY + labelBlockHeight / 2;
  const labelMaxWidth = Math.max(...rutaLines.map((l) => doc.getTextWidth(l)));

  doc.setFont(HFONT, 'normal');
  doc.text('Lugarxy', marginX + labelMaxWidth + 4, valueY);

  // ── Tabla ────────────────────────────────────────────────
  autoTable(doc, {
    startY: 44,
    head: [
      [
        'ID',
        'Fecha',
        'Salida',
        'Llegada',
        'Espera',
        'Pasajeros',
        'Motivo',
        'Solicitante',
        'Área',
        'Ruta',
        'Vehículo',
        'Costo'
      ]
    ],
    body: data.rows.map((row) => [
      row.id,
      row.tripDate,
      row.departureTime,
      row.arrivalTime,
      row.waitingTime,
      row.passengerCount,
      row.reason,
      row.requester.name,
      row.requester.area,
      row.route,
      row.vehicleType,
      `$${row.cost.toFixed(2)}`
    ]),
    foot: [['', '', '', '', '', '', '', '', '', '', 'Total:', `$${data.totalCost.toFixed(2)}`]],
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [220, 220, 220], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // ============== Descarga ============== \\
  doc.save(`${data.meta.workSheetName}_${data.meta.startDate}.pdf`);
};
