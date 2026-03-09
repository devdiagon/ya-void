import { Area } from '../../core/entities/Area.js'
import { getDb } from '../db/database.js'
import { AreaRow, mapRowToArea } from '../mappers/AreaMapper.js'

export class AreaRepository {
  private db = getDb()

  findAllByFarm(farmId: number): Area[] {
    const stmt = this.db.prepare<AreaRow>(
      'SELECT id, name, farm_id, manager_name, manager_cid, deleted_at FROM area WHERE farm_id = ? AND deleted_at IS NULL ORDER BY name'
    )
    const rows = stmt.all(farmId)
    return rows.map(mapRowToArea)
  }

  findById(id: number): Area | null {
    const stmt = this.db.prepare<AreaRow>('SELECT id, name, farm_id, manager_name, manager_cid, deleted_at FROM area WHERE id = ? AND deleted_at IS NULL')
    const row = stmt.get(id)
    return row ? mapRowToArea(row) : null
  }

  create(name: string, farmId: number, managerName: string | null = null, managerCid: string | null = null): Area {
    const insert = this.db.prepare('INSERT INTO area (name, farm_id, manager_name, manager_cid) VALUES (?, ?, ?, ?)')
    const info = insert.run(name, farmId, managerName, managerCid)
    return {
      id: Number(info.lastInsertRowid),
      name,
      farm_id: farmId,
      manager_name: managerName,
      manager_cid: managerCid,
      deletedAt: null
    }
  }

  update(id: number, name: string, farmId: number, managerName: string | null = null, managerCid: string | null = null): boolean {
    const stmt = this.db.prepare('UPDATE area SET name = ?, farm_id = ?, manager_name = ?, manager_cid = ? WHERE id = ?')
    const info = stmt.run(name, farmId, managerName, managerCid, id)
    return info.changes > 0
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare("UPDATE area SET deleted_at = datetime('now') WHERE id = ? AND deleted_at IS NULL")
    const info = stmt.run(id)
    return info.changes > 0
  }
}
