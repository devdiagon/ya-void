import { Farm } from '../../core/entitites/Farm.js'

type FarmRow = {
  id: number
  name: string
}

export function mapRowToFarm(raw: FarmRow): Farm {
  return {
    id: raw.id,
    name: raw.name
  }
}
