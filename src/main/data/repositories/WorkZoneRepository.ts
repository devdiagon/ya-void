import { WorkZone } from '../../core/entities/WorkZone'
import { WorkZoneRepository } from '../repositories/WorkZoneRepository'

export class UseWorkZone {
  private repository: WorkZoneRepository

  constructor(repository: WorkZoneRepository) {
    this.repository = repository
  }

  /**
   * Obtiene la lista completa de zonas de trabajo.
   */
  getAllWorkZones(): WorkZone[] {
    return this.repository.findAll()
  }

  /**
   * Obtiene una zona de trabajo por su identificador.
   */
  getWorkZoneById(id: number): WorkZone | null {
    return this.repository.findById(id)
  }

  /**
   * Registra una nueva zona de trabajo.
   * @param name Nombre de la zona
   * @param startDate Fecha de inicio
   * @param endDate Fecha de fin (opcional)
   */
  createWorkZone(name: string, startDate: string, endDate?: string): WorkZone {
    const newId = this.repository.create({
      name,
      startDate,
      endDate: endDate || null
    })

    return {
      id: newId,
      name,
      startDate,
      endDate: endDate || null
    }
  }

  /**
   * Actualiza la información de una zona existente.
   */
  updateWorkZone(workZone: WorkZone): boolean {
    const existing = this.repository.findById(workZone.id)
    if (!existing) {
      throw new Error(`WorkZone con ID ${workZone.id} no encontrada.`)
    }
    return this.repository.update(workZone)
  }

  /**
   * Elimina una zona de trabajo.
   */
  deleteWorkZone(id: number): void {
    const existing = this.repository.findById(id)
    if (!existing) {
      throw new Error(`No se puede eliminar: WorkZone con ID ${id} no existe.`)
    }
    this.repository.delete(id)
  }
}
