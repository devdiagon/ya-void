import { Area } from '../../core/entities/Area.js'
import { getDb } from '../db/database.js'
import { AreaRow, mapRowToArea } from '../mappers/AreaMapper.js'

export class AreaRepository {
  private db = getDb()

  // Buscar todas las áreas (opcionalmente filtradas por granja)
  findAll(): Area[] {
    const stmt = this.db.prepare<AreaRow[]>('SELECT id, name, farm_id FROM area ORDER BY name')
    const rows = stmt.all() as AreaRow[]
    return rows.map(mapRowToArea)
  }

  // Buscar por ID único
  findById(id: number): Area | null {
    const stmt = this.db.prepare<AreaRow>('SELECT id, name, farm_id FROM area WHERE id = ?')
    const row = stmt.get(id) as AreaRow | undefined
    return row ? mapRowToArea(row) : null
  }

  // Crear una nueva área ligada a una granja
  create(name: string, farm_id: number): Area {
    const insert = this.db.prepare('INSERT INTO area (name, farm_id) VALUES (?, ?)')
    const info = insert.run(name, farm_id)
    return {
      id: Number(info.lastInsertRowid),
      name,
      farm_id
    }
  }

  // Actualizar datos de un área existente
  update(id: number, name: string, farm_id: number): boolean {
    const stmt = this.db.prepare('UPDATE area SET name = ?, farm_id = ? WHERE id = ?')
    const info = stmt.run(name, farm_id, id)
    return info.changes > 0
  }

  // Eliminar un área
  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM area WHERE id = ?')
    const info = stmt.run(id)
    return info.changes > 0
  }
}
