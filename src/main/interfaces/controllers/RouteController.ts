import { Route } from '../../core/entities/Route'
import { UseRoute } from '../../core/use-cases/UseRoute'
import { RouteRepository } from '../../data/repositories/RouteRepository'

export class RouteController {
  private useRoute: UseRoute

  constructor(private routeRepository: RouteRepository) {
    this.useRoute = new UseRoute(this.routeRepository)
  }

  async listByArea(areaId: number): Promise<Route[]> {
    return this.useRoute.getByArea(areaId)
  }

  async getById(id: number): Promise<Route> {
    return this.useRoute.getById(id)
  }

  async create(payload: { name: string; areaId: number }): Promise<Route> {
    return this.useRoute.create(payload.name, payload.areaId)
  }

  async update(id: number, payload: { name: string }): Promise<boolean> {
    return this.useRoute.update(id, payload.name)
  }

  async delete(id: number): Promise<void> {
    return this.useRoute.delete(id)
  }
}
