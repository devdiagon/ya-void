import { FarmRepository } from '../../data/repositories/FarmRepository'
import { Farm } from '../entities/Farm'

export class UseFarm {
  constructor(private farmRepository: FarmRepository) {}

  /**
   * Obtiene todas las fincas registradas
   */
  getAll(): Farm[] {
    return this.farmRepository.findAll()
  }

  /**
   * Obtiene una finca por su ID
   */
  getById(id: number): Farm {
    const farm = this.farmRepository.findById(id)
    if (!farm) {
      throw new Error(`Farm with ID ${id} not found`)
    }
    return farm
  }

  /**
   * Crea una finca validando que el nombre no esté vacío
   */
  create(name: string): Farm {
    if (!name || name.trim() === '') {
      throw new Error('Farm name cannot be empty')
    }
    return this.farmRepository.create(name.trim())
  }

  /**
   * Actualiza una finca existente
   */
  update(id: number, name: string): void {
    if (!name || name.trim() === '') {
      throw new Error('Farm name cannot be empty')
    }

    const success = this.farmRepository.update(id, name.trim())
    if (!success) {
      throw new Error(`Could not update farm: Farm with ID ${id} not found`)
    }
  }

  /**
   * Elimina una finca por su ID
   */
  delete(id: number): void {
    const success = this.farmRepository.delete(id)
    if (!success) {
      throw new Error(`Could not delete farm: Farm with ID ${id} not found`)
    }
  }
}
