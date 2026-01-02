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
}
