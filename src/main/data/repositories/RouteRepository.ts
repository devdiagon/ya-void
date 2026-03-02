import { Route } from '../../core/entities/Route'
import { getDb } from '../db/database'
import { mapRowToRoute, RouteRow } from '../mappers/RouteMapper'

export class RouteRepository {
  private db = getDb()

  /**
   * Obtiene todas las rutas de un área. Las rutas son específicas por área
   * por la constraint UNIQUE(name, area_id).
   */
  findByAreaId(areaId: number): Route[] {
    const stmt = this.db.prepare<RouteRow>(
      'SELECT id, name, area_id FROM route WHERE area_id = ? ORDER BY name'
    )
    return stmt.all(areaId).map(mapRowToRoute)
  }

  findById(id: number): Route | null {
    const stmt = this.db.prepare<RouteRow>('SELECT id, name, area_id FROM route WHERE id = ?')
    const row = stmt.get(id)
    return row ? mapRowToRoute(row) : null
  }

  /**
   * Crea una nueva ruta. Respeta la constraint UNIQUE(name, area_id).
   */
  create(name: string, areaId: number): Route {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre de la ruta no puede estar vacío')

    try {
      const stmt = this.db.prepare('INSERT INTO route (name, area_id) VALUES (?, ?)')
      const info = stmt.run(normalizedName, areaId)
      return { id: Number(info.lastInsertRowid), name: normalizedName, areaId }
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error(`Ya existe una ruta con el nombre "${normalizedName}" en esta área`)
      }
      throw error
    }
  }

  update(id: number, name: string): boolean {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre de la ruta no puede estar vacío')

    try {
      const stmt = this.db.prepare('UPDATE route SET name = ? WHERE id = ?')
      const info = stmt.run(normalizedName, id)
      return info.changes > 0
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error(`Ya existe una ruta con ese nombre en esta área`)
      }
      throw error
    }
  }

  delete(id: number): void {
    const stmt = this.db.prepare('DELETE FROM route WHERE id = ?')
    stmt.run(id)
  }

  /**
   * Devuelve la ruta existente con ese nombre en el área, o la crea si no existe.
   * Usa INSERT OR IGNORE para ser idempotente.
   */
  findOrCreate(name: string, areaId: number): Route {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('El nombre de la ruta no puede estar vacío')

    this.db
      .prepare('INSERT OR IGNORE INTO route (name, area_id) VALUES (?, ?)')
      .run(normalizedName, areaId)

    const row = this.db
      .prepare<RouteRow>('SELECT id, name, area_id FROM route WHERE name = ? AND area_id = ?')
      .get(normalizedName, areaId)

    return mapRowToRoute(row!)
  }
}
