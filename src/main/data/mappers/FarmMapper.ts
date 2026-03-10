import { Farm } from '../../core/entities/Farm.js'

export type FarmRow = {
  id: number
  name: string
  deleted_at: string | null
}

export function mapRowToFarm(raw: FarmRow): Farm {
  return {
    id: raw.id,
    name: raw.name,
    deletedAt: raw.deleted_at ?? null
  }
}
