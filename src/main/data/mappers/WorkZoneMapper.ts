import { WorkZone } from '../../core/entities/WorkZone'

export type WorkZoneRow = {
  id: number
  name: string
  start_date: string
  end_date: string
}

export function mapRowToWorkZone(raw: WorkZoneRow): WorkZone {
  return {
    id: raw.id,
    name: raw.name,
    startDate: new Date(raw.start_date),
    endDate: new Date(raw.end_date)
  }
}
