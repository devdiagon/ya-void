import { RouteRepository } from '../../data/repositories/RouteRepository'
import { Route } from '../entities/Route'

export class UseRoute {
  constructor(private routeRepository: RouteRepository) {}

  /**
   * Obtiene todas las rutas disponibles para un área.
   */
  getByArea(areaId: number): Route[] {
    return this.routeRepository.findByAreaId(areaId)
  }

  /**
   * Obtiene una ruta por su ID.
   */
  getById(id: number): Route {
    const route = this.routeRepository.findById(id)
    if (!route) throw new Error(`La ruta con ID ${id} no existe.`)
    return route
  }

  /**
   * Crea una nueva ruta para un área.
   * El repositorio valida la constraint UNIQUE(name, area_id).
   */
  create(name: string, areaId: number): Route {
    return this.routeRepository.create(name, areaId)
  }

  /**
   * Actualiza el nombre de una ruta.
   */
  update(id: number, name: string): boolean {
    const existing = this.routeRepository.findById(id)
    if (!existing) throw new Error(`La ruta con ID ${id} no existe.`)
    return this.routeRepository.update(id, name)
  }

  /**
   * Elimina una ruta.
   * Nota: Los viajes confirmados conservan el snapshot del nombre aunque se elimine la ruta.
   */
  delete(id: number): void {
    const existing = this.routeRepository.findById(id)
    if (!existing) throw new Error(`La ruta con ID ${id} no existe.`)
    this.routeRepository.delete(id)
  }
}
