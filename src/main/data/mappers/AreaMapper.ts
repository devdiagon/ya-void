import { Area } from '../../core/entitites/Area.js'

type AreaRow = {
  id: number
  name: string
  farm_id: number
}

export function mapRowToArea(raw: AreaRow): Area {
  return {
    id: raw.id,
    name: raw.name,
    farm_id: raw.farm_id
  }
}
