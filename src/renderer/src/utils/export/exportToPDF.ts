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

  // ============== Tabla ============== \\
  autoTable(doc, {
    startY: 44,
    head: [
      [
        'Fecha de\nEjecución del\nTransporte',
        'Hora de ingreso a\nfinca\n(transportista)',
        'Hora de salida de\nla Finca\n(transportista)',
        'Tiempo de\nespera',
        '# Personas',
        'Motivo de contratación de la\nruta extra',
        'Persona que\nsolicita la ruta\nextra',
        'Área de trabajo del\nsolicitante',
        'Ruta extra ejecutada (desde-hasta)\nespecificar si la ruta es de ida y vuelta',
        'Costo',
        'Tipo de\ntransporte',
        'Firma Usuario\nSolicitante'
      ]
    ],
    body: data.rows.map((row) => [
      row.tripDate,
      row.departureTime,
      row.arrivalTime,
      row.waitingTime,
      row.passengerCount,
      row.reason,
      row.requester.name,
      row.requester.area,
      row.route,
      `$${row.cost.toFixed(2)}`,
      row.vehicleType,
      ''
    ]),
    foot: [
      [
        {
          content: 'Total',
          colSpan: 9
        },
        {
          content: `$${data.totalCost.toFixed(2)}`
        },
        { content: '' },
        { content: '' }
      ]
    ],
    styles: {
      font: 'times',
      fontSize: 6.92,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      halign: 'center',
      valign: 'middle',
      cellPadding: 2
    },
    headStyles: {
      fillColor: [0, 32, 96],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineColor: [0, 0, 0],
      lineWidth: 0.2
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'normal',
      halign: 'center',
      valign: 'middle',
      lineColor: [0, 0, 0],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0]
    }
  });

  // ============== Descarga ============== \\
  doc.save(`${data.meta.workSheetName}_${data.meta.startDate}.pdf`);
};
