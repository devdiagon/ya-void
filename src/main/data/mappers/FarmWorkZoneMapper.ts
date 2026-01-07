import { FarmWorkZone } from '../../core/entities/FarmWorkZone'

export type FarmWorkZoneRow = {
  id: number
  work_zone_id: number
  farm_id: number
  name: string
}

export function mapRowToFarmWorkZone(raw: FarmWorkZoneRow): FarmWorkZone {
  return {
    id: raw.id,
    workZoneId: raw.work_zone_id,
    farmId: raw.farm_id,
    name: raw.name
  }
}
