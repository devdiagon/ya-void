import { AreaRepository } from '../../data/repositories/AreaRepository'
import { SubareaRepository } from '../../data/repositories/SubareaRepository'
import { Area } from '../entities/Area'

export class UseArea {
  constructor(
    private areaRepository: AreaRepository,
    private subareaRepository: SubareaRepository
  ) {}

  /**
   * Obtiene todas las áreas de una finca específica
   */
  getAllByFarm(farmId: number): Area[] {
    return this.areaRepository.findAllByFarm(farmId)
  }

  /**
   * Obtiene un área específica por su ID
   */
  getById(id: number): Area {
    const area = this.areaRepository.findById(id)
    if (!area) {
      throw new Error(`Area with ID ${id} not found`)
    }
    return area
  }

  /**
   * Crea una nueva área validando nombre y relación con finca
   */
  create(name: string, farmId: number, managerName: string | null = null, managerCid: string | null = null): Area {
    if (!name || name.trim() === '') {
      throw new Error('Area name cannot be empty')
    }

    if (!farmId || farmId <= 0) {
      throw new Error('A valid Farm ID is required to create an Area')
    }

    const area = this.areaRepository.create(name.trim(), farmId, managerName, managerCid)
    this.subareaRepository.create(area.name, area.id)
    return area
  }

  /**
   * Actualiza los datos de un área
   */
  update(id: number, name: string, farmId: number, managerName: string | null = null, managerCid: string | null = null): void {
    if (!name || name.trim() === '') {
      throw new Error('Area name cannot be empty')
    }

    const success = this.areaRepository.update(id, name.trim(), farmId, managerName, managerCid)
    if (!success) {
      throw new Error(`Could not update area: Area with ID ${id} not found`)
    }
  }

  /**
   * Elimina un área por su ID
   */
  delete(id: number): void {
    const success = this.areaRepository.delete(id)
    if (!success) {
      throw new Error(`Could not delete area: Area with ID ${id} not found`)
    }
  }
}
