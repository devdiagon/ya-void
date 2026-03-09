export interface WorkZoneSheet {
  id: number
  name: string
  farmWorkZoneId: number
  areaId: number
  totalSheet: number
  deletedAt?: string | null
}
