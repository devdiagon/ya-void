import { Route } from '../../core/entities/Route'

export type RouteRow = {
  id: number
  name: string
  area_id: number
}

export function mapRowToRoute(raw: RouteRow): Route {
  return {
    id: raw.id,
    name: raw.name,
    areaId: raw.area_id
  }
}
