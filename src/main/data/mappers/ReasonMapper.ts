import { Reason } from '../../core/entities/Reason'

export type ReasonRow = {
  id: number
  name: string
  area_id: number
}

export function mapRowToReason(raw: ReasonRow): Reason {
  return {
    id: raw.id,
    name: raw.name,
    areaId: raw.area_id
  }
}
