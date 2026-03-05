import { Subarea } from '../../core/entities/Subarea'
import { getDb } from '../db/database'
import { mapRowToSubarea, SubareaRow } from '../mappers/SubareaMapper'

export class SubareaRepository {
  private db = getDb()

  findByAreaId(areaId: number): Subarea[] {
    const stmt = this.db.prepare<SubareaRow>(
      'SELECT id, name, area_id FROM subarea WHERE area_id = ? ORDER BY name'
    )
    return stmt.all(areaId).map(mapRowToSubarea)
  }

  findById(id: number): Subarea | null {
    const stmt = this.db.prepare<SubareaRow>('SELECT id, name, area_id FROM subarea WHERE id = ?')
    const row = stmt.get(id)
    return row ? mapRowToSubarea(row) : null
  }

  create(name: string, areaId: number): Subarea {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre de la subárea no puede estar vacío')

    try {
      const stmt = this.db.prepare('INSERT INTO subarea (name, area_id) VALUES (?, ?)')
      const info = stmt.run(normalizedName, areaId)
      return { id: Number(info.lastInsertRowid), name: normalizedName, areaId }
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as NodeJS.ErrnoException).code === 'SQLITE_CONSTRAINT_UNIQUE'
      ) {
        throw new Error(`Ya existe una subárea con el nombre "${normalizedName}" en esta área`)
      }
      throw error
    }
  }

  update(id: number, name: string): boolean {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre de la subárea no puede estar vacío')

    try {
      const stmt = this.db.prepare('UPDATE subarea SET name = ? WHERE id = ?')
      const info = stmt.run(normalizedName, id)
      return info.changes > 0
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as NodeJS.ErrnoException).code === 'SQLITE_CONSTRAINT_UNIQUE'
      ) {
        throw new Error(`Ya existe una subárea con ese nombre en esta área`)
      }
      throw error
    }
  }

  delete(id: number): void {
    this.db.prepare('UPDATE trip SET subarea_id = NULL WHERE subarea_id = ?').run(id)
    this.db.prepare('DELETE FROM subarea WHERE id = ?').run(id)
  }

  findOrCreate(name: string, areaId: number): Subarea {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre de la subárea no puede estar vacío')

    this.db
      .prepare('INSERT OR IGNORE INTO subarea (name, area_id) VALUES (?, ?)')
      .run(normalizedName, areaId)

    const row = this.db
      .prepare<SubareaRow>(
        'SELECT id, name, area_id FROM subarea WHERE name = ? AND area_id = ?'
      )
      .get(normalizedName, areaId)

    return mapRowToSubarea(row!)
  }
}
