import { Area } from '../../core/entities/Area.js'

export type AreaRow = {
  id: number
  name: string
  farm_id: number
  manager_id: number | null
}

export function mapRowToArea(raw: AreaRow): Area {
  return {
    id: raw.id,
    name: raw.name,
    farm_id: raw.farm_id,
    manager_id: raw.manager_id ?? null
  }
}
