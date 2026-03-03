import { Trip, TripStatus } from '../../core/entities/Trip'
import { getDb } from '../db/database'
import { mapRowToTrip, TripRow } from '../mappers/TripMapper'

const SELECT_TRIP = `
  SELECT id, vehicle_type, status, trip_date, departure_time, arrival_time,
         passenger_count, cost, requester_id, area_id, work_zone_sheet_id,
         route_id, reason_id, route_snapshot, reason_snapshot
  FROM trip
`

export class TripRepository {
  private db = getDb()

  /**
   * Obtiene todos los viajes vinculados a una hoja de zona de trabajo.
   * Ordenados por fecha y hora de salida para presentación cronológica.
   */
  findByWorkZoneSheetId(workZoneSheetId: number): Trip[] {
    const stmt = this.db.prepare<TripRow>(
      `${SELECT_TRIP} WHERE work_zone_sheet_id = ? ORDER BY trip_date, departure_time`
    )
    return stmt.all(workZoneSheetId).map(mapRowToTrip)
  }

  /**
   * Obtiene todos los viajes de un área, aprovechando idx_trip_area_id.
   */
  findByAreaId(areaId: number): Trip[] {
    const stmt = this.db.prepare<TripRow>(
      `${SELECT_TRIP} WHERE area_id = ? ORDER BY trip_date, departure_time`
    )
    return stmt.all(areaId).map(mapRowToTrip)
  }

  /**
   * Filtra viajes por estado (pending / ready), aprovechando idx_trip_status.
   */
  findByStatus(status: TripStatus): Trip[] {
    const stmt = this.db.prepare<TripRow>(
      `${SELECT_TRIP} WHERE status = ? ORDER BY trip_date, departure_time`
    )
    return stmt.all(status).map(mapRowToTrip)
  }

  /**
   * Filtra viajes por un rango de fechas, aprovechando idx_trip_date.
   * Útil para calendarios y reportes.
   */
  findByDateRange(from: string, to: string): Trip[] {
    const stmt = this.db.prepare<TripRow>(
      `${SELECT_TRIP} WHERE trip_date BETWEEN ? AND ? ORDER BY trip_date, departure_time`
    )
    return stmt.all(from, to).map(mapRowToTrip)
  }

  /**
   * Obtiene los viajes de una hoja filtrados por estado.
   * Combinación común para mostrar pendientes/listos dentro de una hoja.
   */
  findByWorkZoneSheetIdAndStatus(workZoneSheetId: number, status: TripStatus): Trip[] {
    const stmt = this.db.prepare<TripRow>(
      `${SELECT_TRIP} WHERE work_zone_sheet_id = ? AND status = ? ORDER BY trip_date, departure_time`
    )
    return stmt.all(workZoneSheetId, status).map(mapRowToTrip)
  }

  /**
   * Busca un viaje por su ID.
   */
  findById(id: number): Trip | null {
    const stmt = this.db.prepare<TripRow>(`${SELECT_TRIP} WHERE id = ?`)
    const row = stmt.get(id)
    return row ? mapRowToTrip(row) : null
  }

  /**
   * Crea un nuevo viaje. El estado inicial es siempre 'pending' sin importar
   * lo que venga en data.status — la única vía para llegar a 'ready' es confirm().
   */
  create(data: Omit<Trip, 'id' | 'status' | 'routeSnapshot' | 'reasonSnapshot'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO trip (
        vehicle_type, status, trip_date, departure_time, arrival_time,
        passenger_count, cost, requester_id, area_id, work_zone_sheet_id,
        route_id, reason_id, route_snapshot, reason_snapshot
      ) VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)
    `)
    const result = stmt.run(
      data.vehicleType,
      data.tripDate,
      data.departureTime,
      data.arrivalTime,
      data.passengerCount,
      data.cost,
      data.requesterId,
      data.areaId,
      data.workZoneSheetId,
      data.routeId,
      data.reasonId
    )
    return result.lastInsertRowid as number
  }

  /**
   * Actualiza los campos operativos de un viaje (mientras está en 'pending').
   * No toca status ni snapshots — esos se gestionan con confirm/reopen.
   */
  update(data: Trip): boolean {
    const stmt = this.db.prepare(`
      UPDATE trip SET
        vehicle_type = ?, trip_date = ?, departure_time = ?,
        arrival_time = ?, passenger_count = ?, cost = ?, requester_id = ?,
        area_id = ?, work_zone_sheet_id = ?, route_id = ?, reason_id = ?
      WHERE id = ?
    `)
    const result = stmt.run(
      data.vehicleType,
      data.tripDate,
      data.departureTime,
      data.arrivalTime,
      data.passengerCount,
      data.cost,
      data.requesterId,
      data.areaId,
      data.workZoneSheetId,
      data.routeId,
      data.reasonId,
      data.id
    )
    return result.changes > 0
  }

  /**
   * Confirma un viaje (pending → ready) capturando atómicamente los snapshots
   * de ruta y motivo en la misma transacción. Garantiza que status='ready'
   * siempre va acompañado del nombre histórico de la ruta/motivo vigentes.
   */
  confirm(id: number): boolean {
    const confirmTx = this.db.transaction(() => {
      const trip = this.findById(id)
      if (!trip) return false

      const routeSnapshot = trip.routeId
        ? (this.db.prepare<{ name: string }>('SELECT name FROM route WHERE id = ?').get(trip.routeId)?.name ?? null)
        : null

      const reasonSnapshot = trip.reasonId
        ? (this.db.prepare<{ name: string }>('SELECT name FROM reason WHERE id = ?').get(trip.reasonId)?.name ?? null)
        : null

      const stmt = this.db.prepare(
        'UPDATE trip SET status = ?, route_snapshot = ?, reason_snapshot = ? WHERE id = ?'
      )
      const result = stmt.run('ready', routeSnapshot, reasonSnapshot, id)
      return result.changes > 0
    })

    return confirmTx() as boolean
  }

  /**
   * Reabre un viaje (ready → pending) limpiando los snapshots.
   * Los snapshots se recapturarán en el próximo confirm.
   */
  reopen(id: number): boolean {
    const stmt = this.db.prepare(
      'UPDATE trip SET status = ?, route_snapshot = NULL, reason_snapshot = NULL WHERE id = ?'
    )
    const result = stmt.run('pending', id)
    return result.changes > 0
  }

  /**
   * Elimina un viaje por su ID.
   */
  delete(id: number): void {
    const stmt = this.db.prepare('DELETE FROM trip WHERE id = ?')
    stmt.run(id)
  }
}
