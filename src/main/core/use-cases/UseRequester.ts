import { RequesterRepository } from '../../data/repositories/RequesterRepository'
import { Requester } from '../entities/Requester'

export class UseRequester {
  constructor(private requesterRepository: RequesterRepository) {}

  /**
   * Obtiene todos los solicitantes globales
   */
  getAll(): Requester[] {
    return this.requesterRepository.findAll()
  }

  /**
   * Obtiene solicitantes filtrados por área
   */
  getByArea(areaId: number): Requester[] {
    return this.requesterRepository.findAllByArea(areaId)
  }

  /**
   * Obtiene solicitantes filtrados por finca (atraviesa áreas)
   */
  getByFarm(farmId: number): Requester[] {
    return this.requesterRepository.getRequestersByFarm(farmId)
  }

  /**
   * Busca un solicitante por su ID
   */
  getById(id: number): Requester {
    const requester = this.requesterRepository.findById(id)
    if (!requester) {
      throw new Error(`Requester with ID ${id} not found`)
    }
    return requester
  }

  /**
   * Crea un nuevo solicitante (el repo ya valida duplicados por nombre)
   */
  create(name: string): Requester {
    return this.requesterRepository.create(name)
  }

  /**
   * Asigna un solicitante existente a un área
   */
  assignToArea(requesterId: number, areaId: number): void {
    const success = this.requesterRepository.createInArea(requesterId, areaId)
    if (!success) {
      // Si el repo devuelve false es porque ya existía la relación
      throw new Error('Requester is already assigned to this area')
    }
  }

  /**
   * Remueve un solicitante de un área específica
   */
  removeFromArea(requesterId: number, areaId: number): void {
    const success = this.requesterRepository.deleteFromArea(requesterId, areaId)
    if (!success) {
      throw new Error('Assignment not found or could not be removed')
    }
  }

  /**
   * Actualiza el nombre del solicitante
   */
  update(id: number, name: string): Requester {
    const updated = this.requesterRepository.update(id, name)
    if (!updated) {
      throw new Error(`Requester with ID ${id} not found to update`)
    }
    return updated
  }

  /**
   * Elimina un solicitante (el repo valida que no tenga viajes asociados)
   */
  delete(id: number): void {
    const success = this.requesterRepository.delete(id)
    if (!success) {
      throw new Error(`Could not delete requester: ID ${id} not found`)
    }
  }
}
