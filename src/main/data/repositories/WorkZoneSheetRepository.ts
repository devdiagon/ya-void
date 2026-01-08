import { WorkZoneSheet } from '../../core/entities/WorkZoneSheet'
import { getDb } from '../db/database'
import { WorkZoneSheetRow, mapRowToWorkZoneSheet } from '../mappers/WorkZoneSheetMapper'

export class WorkZoneSheetRepository {
  private db = getDb()

  /**
   * Obtiene todas las hojas (sheets) vinculadas a una relación granja-zona específica.
   */
  findByFarmWorkZoneId(farmWorkZoneId: number): WorkZoneSheet[] {
    const stmt = this.db.prepare<WorkZoneSheetRow>(
      'SELECT id, name, farm_work_zone_id, area_id, total_sheet FROM work_zone_sheet WHERE farm_work_zone_id = ?'
    )
    const rows = stmt.all(farmWorkZoneId)
    return rows.map(mapRowToWorkZoneSheet)
  }

  /**
   * Busca una hoja de trabajo específica por su ID.
   */
  findById(id: number): WorkZoneSheet | null {
    const stmt = this.db.prepare<WorkZoneSheetRow>(
      'SELECT id, name, farm_work_zone_id, area_id, total_sheet FROM work_zone_sheet WHERE id = ?'
    )
    const row = stmt.get(id)
    return row ? mapRowToWorkZoneSheet(row) : null
  }

  /**
   * Crea un nuevo registro de WorkZoneSheet.
   */
  create(data: Omit<WorkZoneSheet, 'id'>): number {
    const stmt = this.db.prepare(
      'INSERT INTO work_zone_sheet (name, farm_work_zone_id, area_id, total_sheet) VALUES (?, ?, ?, ?)'
    )
    const result = stmt.run(data.name, data.farmWorkZoneId, data.areaId, data.totalSheet)
    return result.lastInsertRowid as number
  }

  /**
   * Actualiza los datos de una hoja de trabajo, como el nombre o el total_sheet.
   */
  update(data: WorkZoneSheet): boolean {
    const stmt = this.db.prepare(
      'UPDATE work_zone_sheet SET name = ?, farm_work_zone_id = ?, area_id = ?, total_sheet = ? WHERE id = ?'
    )
    const result = stmt.run(data.name, data.farmWorkZoneId, data.areaId, data.totalSheet, data.id)
    return result.changes > 0
  }

  /**
   * Elimina una hoja de trabajo.
   * Nota: Esto puede afectar a la tabla 'trip' si hay viajes vinculados a este sheet_id.
   */
  delete(id: number): void {
    const stmt = this.db.prepare('DELETE FROM work_zone_sheet WHERE id = ?')
    stmt.run(id)
  }
}
