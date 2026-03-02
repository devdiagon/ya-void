import { Reason } from '../../core/entities/Reason'
import { getDb } from '../db/database'
import { mapRowToReason, ReasonRow } from '../mappers/ReasonMapper'

export class ReasonRepository {
  private db = getDb()

  /**
   * Obtiene todos los motivos de un área. Los motivos son específicos por área
   * por la constraint UNIQUE(name, area_id).
   */
  findByAreaId(areaId: number): Reason[] {
    const stmt = this.db.prepare<ReasonRow>(
      'SELECT id, name, area_id FROM reason WHERE area_id = ? ORDER BY name'
    )
    return stmt.all(areaId).map(mapRowToReason)
  }

  findById(id: number): Reason | null {
    const stmt = this.db.prepare<ReasonRow>('SELECT id, name, area_id FROM reason WHERE id = ?')
    const row = stmt.get(id)
    return row ? mapRowToReason(row) : null
  }

  /**
   * Crea un nuevo motivo. Respeta la constraint UNIQUE(name, area_id).
   */
  create(name: string, areaId: number): Reason {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre del motivo no puede estar vacío')

    try {
      const stmt = this.db.prepare('INSERT INTO reason (name, area_id) VALUES (?, ?)')
      const info = stmt.run(normalizedName, areaId)
      return { id: Number(info.lastInsertRowid), name: normalizedName, areaId }
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error(`Ya existe un motivo con el nombre "${normalizedName}" en esta área`)
      }
      throw error
    }
  }

  update(id: number, name: string): boolean {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre del motivo no puede estar vacío')

    try {
      const stmt = this.db.prepare('UPDATE reason SET name = ? WHERE id = ?')
      const info = stmt.run(normalizedName, id)
      return info.changes > 0
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error(`Ya existe un motivo con ese nombre en esta área`)
      }
      throw error
    }
  }

  delete(id: number): void {
    const stmt = this.db.prepare('DELETE FROM reason WHERE id = ?')
    stmt.run(id)
  }

  /**
   * Devuelve el motivo existente con ese nombre en el área, o lo crea si no existe.
   * Usa INSERT OR IGNORE para ser idempotente.
   */
  findOrCreate(name: string, areaId: number): Reason {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre del motivo no puede estar vacío')

    this.db
      .prepare('INSERT OR IGNORE INTO reason (name, area_id) VALUES (?, ?)')
      .run(normalizedName, areaId)

    const row = this.db
      .prepare<ReasonRow>('SELECT id, name, area_id FROM reason WHERE name = ? AND area_id = ?')
      .get(normalizedName, areaId)

    return mapRowToReason(row!)
  }
}
