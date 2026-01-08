import { FarmWorkZoneRepository } from '../../data/repositories/FarmWorkZoneRepository'
import { FarmWorkZone } from '../entities/FarmWorkZone'

export class UseFarmWorkZone {
  private repository: FarmWorkZoneRepository

  constructor(repository: FarmWorkZoneRepository) {
    this.repository = repository
  }

  /**
   * Obtiene todas las granjas asociadas a una WorkZone específica.
   */
  getFarmsByWorkZone(workZoneId: number): FarmWorkZone[] {
    return this.repository.findByWorkZoneId(workZoneId)
  }

  /**
   * Obtiene una relación específica por su ID.
   */
  getFarmWorkZoneById(id: number): FarmWorkZone | null {
    return this.repository.findById(id)
  }

  /**
   * Vincula una granja a una zona de trabajo.
   */
  createFarmWorkZone(workZoneId: number, farmId: number, name: string): FarmWorkZone {
    // Aquí podrías añadir validaciones, por ejemplo, verificar si la granja
    // ya está vinculada a esa zona de trabajo antes de crearla.

    const newId = this.repository.create({
      workZoneId,
      farmId,
      name
    })

    return {
      id: newId,
      workZoneId,
      farmId,
      name
    }
  }

  /**
   * Actualiza los datos de la relación (ej. cambiar el nombre descriptivo).
   */
  updateFarmWorkZone(data: FarmWorkZone): boolean {
    const existing = this.repository.findById(data.id)
    if (!existing) {
      throw new Error(`La relación FarmWorkZone con ID ${data.id} no existe.`)
    }
    return this.repository.update(data)
  }

  /**
   * Elimina la vinculación de la granja con la zona de trabajo.
   */
  deleteFarmWorkZone(id: number): void {
    const existing = this.repository.findById(id)
    if (!existing) {
      throw new Error(`No se encontró la relación con ID ${id} para eliminar.`)
    }
    this.repository.delete(id)
  }
}
