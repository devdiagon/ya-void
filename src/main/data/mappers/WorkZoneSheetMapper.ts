import { WorkZoneSheet } from '../../core/entities/WorkZoneSheet'

export type WorkZoneSheetRow = {
  id: number
  name: string
  farm_work_zone_id: number
  area_id: number
  total_sheet: number
}

export function mapRowToWorkZoneSheet(raw: WorkZoneSheetRow): WorkZoneSheet {
  return {
    id: raw.id,
    name: raw.name,
    farmWorkZoneId: raw.farm_work_zone_id,
    areaId: raw.area_id,
    totalSheet: raw.total_sheet
  }
}
