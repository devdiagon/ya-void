import { FarmWorkZone } from '../../core/entities/FarmWorkZone'
import { getDb } from '../db/database'
import { FarmWorkZoneRow, mapRowToFarmWorkZone } from '../mappers/FarmWorkZoneMapper'

export class FarmWorkZoneRepository {
  private db = getDb()

  /**
   * Obtiene todas las granjas vinculadas a una zona de trabajo (WorkZone) específica.
   */
  findByWorkZoneId(workZoneId: number): FarmWorkZone[] {
    const stmt = this.db.prepare<FarmWorkZoneRow>(
      'SELECT id, work_zone_id, farm_id, name FROM farm_work_zone WHERE work_zone_id = ?'
    )
    const rows = stmt.all(workZoneId)
    return rows.map(mapRowToFarmWorkZone)
  }

  /**
   * Busca una relación específica por su ID.
   */
  findById(id: number): FarmWorkZone | null {
    const stmt = this.db.prepare<FarmWorkZoneRow>(
      'SELECT id, work_zone_id, farm_id, name FROM farm_work_zone WHERE id = ?'
    )
    const row = stmt.get(id)
    return row ? mapRowToFarmWorkZone(row) : null
  }

  /**
   * Crea una nueva asociación Farm <-> WorkZone.
   */
  create(data: Omit<FarmWorkZone, 'id'>): number {
    const stmt = this.db.prepare(
      'INSERT INTO farm_work_zone (work_zone_id, farm_id, name) VALUES (?, ?, ?)'
    )
    const result = stmt.run(data.workZoneId, data.farmId, data.name)
    return result.lastInsertRowid as number
  }

  /**
   * Actualiza los datos de la asociación.
   */
  update(data: FarmWorkZone): boolean {
    const stmt = this.db.prepare(
      'UPDATE farm_work_zone SET work_zone_id = ?, farm_id = ?, name = ? WHERE id = ?'
    )
    const result = stmt.run(data.workZoneId, data.farmId, data.name, data.id)
    return result.changes > 0
  }

  /**
   * Elimina la asociación.
   * Nota: Esto afectará a 'work_zone_sheet' si existen registros vinculados.
   */
  delete(id: number): void {
    const stmt = this.db.prepare('DELETE FROM farm_work_zone WHERE id = ?')
    stmt.run(id)
  }
}
