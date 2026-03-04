import { ExportTripWorkSheet } from '@renderer/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportTripsToPDF = (data: ExportTripWorkSheet) => {
  const doc = new jsPDF({ orientation: 'landscape' });

  // ── Encabezado ──────────────────────────────────────────
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(data.meta.workSheetName, 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Finca: ${data.meta.farmName}`, 14, 23);
  doc.text(`Área: ${data.meta.areaName}`, 14, 29);
  doc.text(`Período: ${data.meta.startDate} — ${data.meta.endDate}`, 14, 35);

  // ── Tabla ────────────────────────────────────────────────
  autoTable(doc, {
    startY: 42,
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

  // ── Descarga ─────────────────────────────────────────────
  doc.save(`${data.meta.workSheetName}_${data.meta.startDate}.pdf`);
};
