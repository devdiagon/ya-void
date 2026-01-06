import { Area } from '../../core/entities/Area.js'
import { getDb } from '../db/database.js'
import { AreaRow, mapRowToArea } from '../mappers/AreaMapper.js'

export class AreaRepository {
  private db = getDb()

  findAllByFarm(farmId: number): Area[] {
    const stmt = this.db.prepare<AreaRow>(
      'SELECT id, name, farm_id FROM area WHERE farm_id = ? ORDER BY name'
    )
    const rows = stmt.all(farmId)
    return rows.map(mapRowToArea)
  }

  findById(id: number): Area | null {
    const stmt = this.db.prepare<AreaRow>('SELECT id, name, farm_id FROM area WHERE id = ?')
    const row = stmt.get(id)
    return row ? mapRowToArea(row) : null
  }

  create(name: string, farmId: number): Area {
    const insert = this.db.prepare('INSERT INTO area (name, farm_id) VALUES (?, ?)')
    const info = insert.run(name, farmId)
    return {
      id: Number(info.lastInsertRowid),
      name,
      farm_id: farmId
    }
  }

  // Sugerencia: pasar el objeto Area completo para mayor consistencia
  update(id: number, name: string, farmId: number): boolean {
    const stmt = this.db.prepare('UPDATE area SET name = ?, farm_id = ? WHERE id = ?')
    const info = stmt.run(name, farmId, id)
    return info.changes > 0
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM area WHERE id = ?')
    const info = stmt.run(id)
    return info.changes > 0
  }
}
