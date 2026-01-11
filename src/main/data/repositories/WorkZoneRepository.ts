import { WorkZone } from '../../core/entities/WorkZone'
import { getDb } from '../db/database'
import { WorkZoneRow, mapRowToWorkZone } from '../mappers/WorkZoneMapper'

export class WorkZoneRepository {
  private db = getDb()

  /**
   * Obtiene todas las zonas de trabajo ordenadas por nombre.
   */
  findAll(): WorkZone[] {
    const stmt = this.db.prepare<WorkZoneRow>(
      'SELECT id, name, start_date, end_date FROM work_zone ORDER BY start_date DESC'
    )
    const rows = stmt.all()
    return rows.map(mapRowToWorkZone)
  }

  /**
   * Busca una zona de trabajo específica por su ID.
   */
  findById(id: number): WorkZone | null {
    const stmt = this.db.prepare<WorkZoneRow>(
      'SELECT id, name, start_date, end_date FROM work_zone WHERE id = ?'
    )
    const row = stmt.get(id)
    return row ? mapRowToWorkZone(row) : null
  }

  /**
   * Crea una nueva zona de trabajo.
   */
  create(workZone: Omit<WorkZone, 'id'>): number {
    const stmt = this.db.prepare(
      'INSERT INTO work_zone (name, start_date, end_date) VALUES (?, ?, ?)'
    )
    const result = stmt.run(workZone.name, workZone.startDate, workZone.endDate)
    return result.lastInsertRowid as number
  }

  /**
   * Actualiza los datos de una zona de trabajo existente.
   */
  update(workZone: WorkZone): void {
    const stmt = this.db.prepare(
      'UPDATE work_zone SET name = ?, start_date = ?, end_date = ? WHERE id = ?'
    )
    stmt.run(workZone.name, workZone.startDate, workZone.endDate, workZone.id)
  }

  /**
   * Elimina una zona de trabajo por su ID.
   * Nota: Debido a las claves foráneas, esto podría fallar si hay registros en 'farm_work_zone'.
   */
  delete(id: number): void {
    const stmt = this.db.prepare('DELETE FROM work_zone WHERE id = ?')
    stmt.run(id)
  }
}
