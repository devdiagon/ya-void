import { WorkZoneRepository } from '../../data/repositories/WorkZoneRepository'
import { WorkZone } from '../entities/WorkZone'

export class UseWorkZone {
  constructor(private workZoneRepository: WorkZoneRepository) {}

  /**
   * Obtiene todas las zonas de trabajo
   */
  getAll(): WorkZone[] {
    return this.workZoneRepository.findAll()
  }

  /**
   * Obtiene una zona de trabajo por su ID
   */
  getById(id: number): WorkZone {
    const workZone = this.workZoneRepository.findById(id)
    if (!workZone) {
      throw new Error(`Work Zone with ID ${id} not found`)
    }
    return workZone
  }

  /**
   * Crea una zona de trabajo validando campos y coherencia de fechas
   */
  create(data: { name: string; startDate: string; endDate: string }): WorkZone {
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    this.validateData({ name: data.name, startDate, endDate })

    const id = this.workZoneRepository.create({
      name: data.name.trim(),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    })

    return {
      id,
      name: data.name.trim(),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    }
  }

  /**
   * Actualiza una zona de trabajo existente
   */
  update(workZone: WorkZone): void {
    this.validateData(workZone)

    // Verificamos si existe antes de intentar actualizar
    const existing = this.workZoneRepository.findById(workZone.id)
    if (!existing) {
      throw new Error(`Could not update: Work Zone with ID ${workZone.id} not found`)
    }

    this.workZoneRepository.update({
      ...workZone,
      name: workZone.name.trim()
    })
  }

  /**
   * Elimina una zona de trabajo
   */
  delete(id: number): void {
    const existing = this.workZoneRepository.findById(id)
    if (!existing) {
      throw new Error(`Could not delete: Work Zone with ID ${id} not found`)
    }

    try {
      this.workZoneRepository.delete(id)
    } catch {
      // Manejo por si existen restricciones de llave foránea (farm_work_zone)
      throw new Error('Cannot delete Work Zone because it is assigned to one or more farms')
    }
  }

  /**
   * Validaciones privadas de lógica de negocio
   */
  private validateData(data: { name: string; startDate: Date; endDate: Date }): void {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Work Zone name cannot be empty')
    }

    if (!(data.startDate instanceof Date) || !(data.endDate instanceof Date)) {
      throw new Error('Invalid dates')
    }

    if (data.startDate > data.endDate) {
      throw new Error('Start date cannot be later than end date')
    }
  }
}
