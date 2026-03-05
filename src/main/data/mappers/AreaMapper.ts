import { Area } from '../../core/entities/Area.js'

export type AreaRow = {
  id: number
  name: string
  farm_id: number
  manager_name: string | null
  manager_cid: string | null
}

export function mapRowToArea(raw: AreaRow): Area {
  return {
    id: raw.id,
    name: raw.name,
    farm_id: raw.farm_id,
    manager_name: raw.manager_name ?? null,
    manager_cid: raw.manager_cid ?? null
  }
}
