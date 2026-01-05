import { Farm } from '../../core/entities/Farm'
import { getDb } from '../db/database'
import { FarmRow, mapRowToFarm } from '../mappers/FarmMapper'

export class FarmRepository {
  private db = getDb()

  findAll(): Farm[] {
    const stmt = this.db.prepare<FarmRow>('SELECT id, name FROM farm ORDER BY name')
    const rows = stmt.all()
    return rows.map(mapRowToFarm)
  }

  create(name: string): Farm {
    const insert = this.db.prepare('INSERT INTO farm (name) VALUES (?)')
    const info = insert.run(name)
    return { id: info.lastInsertRowid, name }
  }

  findById(id: number): Farm | null {
    const stmt = this.db.prepare<FarmRow>('SELECT id, name FROM farm WHERE id = ?')
    const row = stmt.get(id) as FarmRow | undefined
    return row ? mapRowToFarm(row) : null
  }

  update(id: number, name: string): boolean {
    const stmt = this.db.prepare('UPDATE farm SET name = ? WHERE id = ?')
    const info = stmt.run(name, id)
    return info.changes > 0
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM farm WHERE id = ?')
    const info = stmt.run(id)
    return info.changes > 0
  }
}
