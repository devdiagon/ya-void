import { Subarea } from '../../core/entities/Subarea'

export type SubareaRow = {
  id: number
  name: string
  area_id: number
}

export function mapRowToSubarea(raw: SubareaRow): Subarea {
  return {
    id: raw.id,
    name: raw.name,
    areaId: raw.area_id
  }
}
