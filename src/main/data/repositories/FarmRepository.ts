import { Farm } from '../../core/entitites/Farm'
import { getDb } from '../db/database'
import { mapRowToFarm } from '../mappers/FarmMapper.js'

export class FarmRepository {
  private db = getDb()

  findAll(): Farm[] {
    const stmt = this.db.prepare('SELECT id, name FROM farm ORDER BY name')
    const rows = stmt.all()
    return rows.map(mapRowToFarm)
  }
}
