import { FarmWorkZone } from '../../core/entities/FarmWorkZone'
import { UseFarmWorkZone } from '../../core/use-cases/UseFarmWorkZone'
import { FarmWorkZoneRepository } from '../../data/repositories/FarmWorkZoneRepository'

export class FarmWorkZoneController {
  private useFarmWorkZone: UseFarmWorkZone

  constructor(private farmWorkZoneRepository: FarmWorkZoneRepository) {
    this.useFarmWorkZone = new UseFarmWorkZone(this.farmWorkZoneRepository)
  }

  /**
   * Lista todas las granjas vinculadas a una WorkZone específica.
   */
  async listByWorkZone(workZoneId: number): Promise<FarmWorkZone[]> {
    return this.useFarmWorkZone.getFarmsByWorkZone(workZoneId)
  }

  /**
   * Obtiene una relación específica por ID.
   */
  async getById(id: number): Promise<FarmWorkZone | null> {
    return this.useFarmWorkZone.getFarmWorkZoneById(id)
  }

  /**
   * Crea la vinculación entre una granja y una zona de trabajo.
   */
  async create(payload: {
    workZoneId: number
    farmId: number
    name: string
  }): Promise<FarmWorkZone> {
    return this.useFarmWorkZone.createFarmWorkZone(payload.workZoneId, payload.farmId, payload.name)
  }

  /**
   * Actualiza los datos de la relación.
   */
  async update(payload: FarmWorkZone): Promise<boolean> {
    return this.useFarmWorkZone.updateFarmWorkZone(payload)
  }

  /**
   * Elimina la vinculación.
   */
  async delete(id: number): Promise<void> {
    return this.useFarmWorkZone.deleteFarmWorkZone(id)
  }
}
