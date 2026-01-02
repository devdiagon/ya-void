import { Farm } from '../../core/entities/Farm.js'

export type FarmRow = {
  id: number
  name: string
}

export function mapRowToFarm(raw: FarmRow): Farm {
  return {
    id: raw.id,
    name: raw.name
  }
}
