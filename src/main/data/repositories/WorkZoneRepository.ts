import { ExportWorkZoneSheet } from '../../core/entities/ExportWorkZoneSheet'
import { WorkZone } from '../../core/entities/WorkZone'
import { getDb } from '../db/database'
import { ExportTripRow, mapRowToExportWorkZoneSheet } from '../mappers/ExportWorkZoneSheetMapper'
import { WorkZoneRow, mapRowToWorkZone } from '../mappers/WorkZoneMapper'

export class WorkZoneRepository {
  private db = getDb()

  private toDateString(value: Date): string {
    return value.toISOString().slice(0, 10)
  }

  /**
   * Obtiene todas las zonas de trabajo ordenadas por nombre.
   */
  findAll(): WorkZone[] {
    const stmt = this.db.prepare<WorkZoneRow>(
      'SELECT id, name, start_date, end_date, deleted_at FROM work_zone WHERE deleted_at IS NULL ORDER BY start_date DESC'
    )
    const rows = stmt.all()
    return rows.map(mapRowToWorkZone)
  }

  /**
   * Busca una zona de trabajo específica por su ID.
   */
  findById(id: number): WorkZone | null {
    const stmt = this.db.prepare<WorkZoneRow>(
      'SELECT id, name, start_date, end_date, deleted_at FROM work_zone WHERE id = ? AND deleted_at IS NULL'
    )
    const row = stmt.get(id)
    return row ? mapRowToWorkZone(row) : null
  }

  /**
   * Obtiene todos los viajes con status 'ready'
   *   estos viajes pertenecen a una área (WorkZoneSheet) de una zona de trabajo y finca específica de esa zona de trabajo
   * Esta consulta se encarga de agrupar TODAS las áreas de la zona de trabajo y la finca especificada
   * 
   * @ejemplo
   * Zona de trabajo: "Zona de Trabajo 1" y finca: "Finca A"
   *  Tienen las áreas ---> Area1, Area2, Area3, ...
   *  Por cada área ---> se obtienen los viajes con status 'ready'  
   */
  getAllFarmRelatedTrips(workZoneId: number, farmWorkZoneId: number): ExportWorkZoneSheet[] {
    const stmt = this.db.prepare(`
      SELECT
        wzs.id                        AS work_zone_sheet_id,
        f.name                        AS farm_name,
        a.name                        AS area_name,
        wz.start_date                 AS start_date,
        wz.end_date                   AS end_date,
        wzs.name                      AS work_sheet_name,
        a.manager_name                AS manager_name,
        a.manager_cid                 AS manager_ci,
        t.id                          AS trip_id,
        t.trip_date                   AS trip_date,
        t.departure_time              AS departure_time,
        t.arrival_time                AS arrival_time,
        t.passenger_count             AS passenger_count,
        COALESCE(t.reason_snapshot,   r.name)  AS reason,
        COALESCE(t.route_snapshot,    ro.name) AS route,
        COALESCE(t.subarea_snapshot,  sa.name) AS subarea,
        t.cost                        AS cost,
        t.vehicle_type                AS vehicle_type,
        req.name                      AS requester_name,
        req_area.name                 AS requester_area
      FROM work_zone_sheet wzs
      INNER JOIN farm_work_zone fwz ON fwz.id = wzs.farm_work_zone_id
      INNER JOIN work_zone wz       ON wz.id  = fwz.work_zone_id
      INNER JOIN farm f             ON f.id   = fwz.farm_id
      INNER JOIN area a             ON a.id   = wzs.area_id
      INNER JOIN trip t             ON t.work_zone_sheet_id = wzs.id
      LEFT JOIN  reason r           ON r.id   = t.reason_id
      LEFT JOIN  route ro           ON ro.id  = t.route_id
      LEFT JOIN  subarea sa         ON sa.id  = t.subarea_id
      LEFT JOIN  requester req      ON req.id = t.requester_id
      LEFT JOIN  area req_area      ON req_area.id = t.area_id
      WHERE fwz.work_zone_id        = ?
        AND wzs.farm_work_zone_id   = ?
        AND t.status                = 'ready'
      ORDER BY
        wzs.id,
        t.trip_date       ASC,
        t.departure_time  ASC
    `)

    const rows = stmt.all(workZoneId, farmWorkZoneId) as ExportTripRow[]
    return mapRowToExportWorkZoneSheet(rows)
  }

  /**
   * Crea una nueva zona de trabajo.
   */
  create(workZone: Omit<WorkZone, 'id'>): number {
    const stmt = this.db.prepare(
      'INSERT INTO work_zone (name, start_date, end_date) VALUES (?, ?, ?)'
    )
    const result = stmt.run(
      workZone.name,
      this.toDateString(workZone.startDate),
      this.toDateString(workZone.endDate)
    )
    return result.lastInsertRowid as number
  }

  /**
   * Actualiza los datos de una zona de trabajo existente.
   */
  update(workZone: WorkZone): void {
    const stmt = this.db.prepare(
      'UPDATE work_zone SET name = ?, start_date = ?, end_date = ? WHERE id = ?'
    )
    stmt.run(
      workZone.name,
      this.toDateString(workZone.startDate),
      this.toDateString(workZone.endDate),
      workZone.id
    )
  }

  /**
   * Elimina una zona de trabajo por su ID.
   * Nota: Debido a las claves foráneas, esto podría fallar si hay registros en 'farm_work_zone'.
   */
  delete(id: number): void {
    const stmt = this.db.prepare("UPDATE work_zone SET deleted_at = datetime('now') WHERE id = ? AND deleted_at IS NULL")
    stmt.run(id)
  }
}
