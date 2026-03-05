import { Area } from '../../core/entities/Area'
import { UseArea } from '../../core/use-cases/UseArea'
import { AreaRepository } from '../../data/repositories/AreaRepository'

export class AreaController {
  private useArea: UseArea

  constructor(private areaRepository: AreaRepository) {
    this.useArea = new UseArea(this.areaRepository)
  }

  /**
   * Lista todas las áreas de una finca específica
   * @param farmId ID de la finca
   */
  async listByFarm(farmId: number): Promise<Area[]> {
    return this.useArea.getAllByFarm(farmId)
  }

  /**
   * Obtiene un área por su ID
   */
  async getById(id: number): Promise<Area> {
    return this.useArea.getById(id)
  }

  /**
   * Crea una nueva área vinculada a una finca
   */
  async create(payload: { name: string; farmId: number; managerId?: number | null }): Promise<Area> {
    return this.useArea.create(payload.name, payload.farmId, payload.managerId ?? null)
  }

  /**
   * Actualiza el nombre o la vinculación de una finca
   */
  async update(id: number, payload: { name: string; farmId: number; managerId?: number | null }): Promise<void> {
    return this.useArea.update(id, payload.name, payload.farmId, payload.managerId ?? null)
  }

  /**
   * Elimina un área por su ID
   */
  async delete(id: number): Promise<void> {
    return this.useArea.delete(id)
  }
}
