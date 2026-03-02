import { ReasonRepository } from '../../data/repositories/ReasonRepository'
import { Reason } from '../entities/Reason'

export class UseReason {
  constructor(private reasonRepository: ReasonRepository) {}

  /**
   * Obtiene todos los motivos disponibles para un área.
   */
  getByArea(areaId: number): Reason[] {
    return this.reasonRepository.findByAreaId(areaId)
  }

  /**
   * Obtiene un motivo por su ID.
   */
  getById(id: number): Reason {
    const reason = this.reasonRepository.findById(id)
    if (!reason) throw new Error(`El motivo con ID ${id} no existe.`)
    return reason
  }

  /**
   * Crea un nuevo motivo para un área.
   * El repositorio valida la constraint UNIQUE(name, area_id).
   */
  create(name: string, areaId: number): Reason {
    return this.reasonRepository.create(name, areaId)
  }

  /**
   * Actualiza el nombre de un motivo.
   */
  update(id: number, name: string): boolean {
    const existing = this.reasonRepository.findById(id)
    if (!existing) throw new Error(`El motivo con ID ${id} no existe.`)
    return this.reasonRepository.update(id, name)
  }

  /**
   * Elimina un motivo.
   * Nota: Los viajes confirmados conservan el snapshot del nombre aunque se elimine el motivo.
   */
  delete(id: number): void {
    const existing = this.reasonRepository.findById(id)
    if (!existing) throw new Error(`El motivo con ID ${id} no existe.`)
    this.reasonRepository.delete(id)
  }

  /**
   * Devuelve el motivo con ese nombre en el área, o lo crea si no existe.
   * Usar desde el formulario de viaje para autocompletar con creación automática.
   */
  findOrCreate(name: string, areaId: number): Reason {
    return this.reasonRepository.findOrCreate(name, areaId)
  }
}
