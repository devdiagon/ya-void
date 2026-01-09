import { Requester } from '../../core/entities/Requester'
import { getDb } from '../db/database'
import { mapRowToRequester, RequesterRow } from '../mappers/RequesterMapper.js'

export class RequesterRepository {
  private db = getDb()

  findAll(): Requester[] {
    try {
      const stmt = this.db.prepare<RequesterRow>('SELECT id, name FROM requester ORDER BY name')
      const rows = stmt.all()
      return rows.map(mapRowToRequester)
    } catch (error) {
      console.error('Error in findAll:', error)
      throw new Error('Could not retrieve requesters')
    }
  }

  findAllByArea(area_id: number): Requester[] {
    try {
      const stmt = this.db.prepare<RequesterRow>(
        `SELECT DISTINCT r.id, r.name
         FROM requester r
         JOIN area_requester ar ON r.id = ar.requester_id
         WHERE ar.area_id = ?
         ORDER BY r.name`
      )
      const rows = stmt.all(area_id)
      return rows.map(mapRowToRequester)
    } catch (error) {
      console.error(`Error in findAllByArea for area ${area_id}:`, error)
      throw new Error(`Could not retrieve requesters for area ${area_id}`)
    }
  }

  findById(id: number): Requester | null {
    try {
      const stmt = this.db.prepare<RequesterRow>('SELECT id, name FROM requester WHERE id = ?')
      const row = stmt.get(id)
      return row ? mapRowToRequester(row) : null
    } catch (error) {
      console.error(`Error in findById for ID ${id}:`, error)
      throw new Error('Error searching for requester')
    }
  }

  create(name: string): Requester {
    const normalizedName = name.trim()
    if (!normalizedName) throw new Error('Requester name cannot be empty')

    try {
      const insert = this.db.prepare('INSERT INTO requester (name) VALUES (?)')
      const info = insert.run(normalizedName)
      return { id: Number(info.lastInsertRowid), name: normalizedName }
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('A requester with that name already exists')
      }
      throw error
    }
  }

  createInArea(requesterId: number, areaId: number): boolean {
    try {
      // Check if relation already exists
      const checkStmt = this.db.prepare<{ count: number }>(
        'SELECT COUNT(*) as count FROM area_requester WHERE area_id = ? AND requester_id = ?'
      )
      const check = checkStmt.get(areaId, requesterId) as { count: number }

      if (check.count > 0) {
        return false // Relation already exists
      }

      const insert = this.db.prepare(
        'INSERT INTO area_requester (area_id, requester_id) VALUES (?, ?)'
      )
      const info = insert.run(areaId, requesterId)

      return info.changes > 0
    } catch (error) {
      console.error(`Error in createInArea for requester ${requesterId}, area ${areaId}:`, error)
      throw new Error('Could not assign requester to area')
    }
  }

  deleteFromArea(requesterId: number, areaId: number): boolean {
    try {
      const stmt = this.db.prepare(
        'DELETE FROM area_requester WHERE area_id = ? AND requester_id = ?'
      )
      const info = stmt.run(areaId, requesterId)
      return info.changes > 0
    } catch (error) {
      console.error(`Error in deleteFromArea for requester ${requesterId}, area ${areaId}:`, error)
      throw new Error('Could not remove requester assignment from area')
    }
  }

  update(id: number, name: string): Requester | null {
    try {
      if (!name || name.trim() === '') {
        throw new Error('Requester name cannot be empty')
      }

      const normalizedName = name.trim()

      // Check if new name already exists in another requester
      const existingStmt = this.db.prepare<{ id: number; count: number }>(
        'SELECT id, COUNT(*) as count FROM requester WHERE name = ? AND id != ?'
      )
      const existing = existingStmt.get(normalizedName, id) as { id: number; count: number }

      if (existing.count > 0) {
        throw new Error('Another requester with that name already exists')
      }

      const stmt = this.db.prepare('UPDATE requester SET name = ? WHERE id = ?')
      const info = stmt.run(normalizedName, id)

      if (info.changes > 0) {
        return { id, name: normalizedName }
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        throw error
      }
      console.error(`Error in update for ID ${id}:`, error)
      throw new Error('Could not update requester')
    }
  }

  delete(id: number): boolean {
    try {
      // Check if requester is being used in trips
      const checkTripsStmt = this.db.prepare<{ count: number }>(
        'SELECT COUNT(*) as count FROM trip WHERE requester_id = ?'
      )
      const tripsCount = checkTripsStmt.get(id) as { count: number }

      if (tripsCount.count > 0) {
        throw new Error('Cannot delete requester because it has associated trips')
      }

      // Delete area relations first
      const deleteRelationsStmt = this.db.prepare(
        'DELETE FROM area_requester WHERE requester_id = ?'
      )
      deleteRelationsStmt.run(id)

      // Then delete the requester
      const stmt = this.db.prepare('DELETE FROM requester WHERE id = ?')
      const info = stmt.run(id)

      return info.changes > 0
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot delete')) {
        throw error
      }
      console.error(`Error in delete for ID ${id}:`, error)
      throw new Error('Could not delete requester')
    }
  }

  getRequestersByFarm(farmId: number): Requester[] {
    try {
      const stmt = this.db.prepare<RequesterRow>(
        `SELECT DISTINCT r.id, r.name
         FROM requester r
         JOIN area_requester ar ON r.id = ar.requester_id
         JOIN area a ON ar.area_id = a.id
         WHERE a.farm_id = ?
         ORDER BY r.name`
      )
      return stmt.all(farmId).map(mapRowToRequester)
    } catch (error) {
      console.error(`Error in getRequestersByFarm:`, error)
      throw new Error(`Could not retrieve requesters for farm ${farmId}`)
    }
  }

  exists(id: number): boolean {
    try {
      const stmt = this.db.prepare<{ count: number }>(
        'SELECT COUNT(*) as count FROM requester WHERE id = ?'
      )
      const result = stmt.get(id) as { count: number }
      return result.count > 0
    } catch (error) {
      console.error(`Error in exists for ID ${id}:`, error)
      throw new Error('Error checking if requester exists')
    }
  }
}
