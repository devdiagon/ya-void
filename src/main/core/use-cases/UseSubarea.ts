import { SubareaRepository } from '../../data/repositories/SubareaRepository'
import { Subarea } from '../entities/Subarea'

export class UseSubarea {
  constructor(private subareaRepository: SubareaRepository) {}

  getByArea(areaId: number): Subarea[] {
    return this.subareaRepository.findByAreaId(areaId)
  }

  getById(id: number): Subarea {
    const subarea = this.subareaRepository.findById(id)
    if (!subarea) throw new Error(`La subárea con ID ${id} no existe.`)
    return subarea
  }

  create(name: string, areaId: number): Subarea {
    return this.subareaRepository.create(name, areaId)
  }

  update(id: number, name: string): boolean {
    const existing = this.subareaRepository.findById(id)
    if (!existing) throw new Error(`La subárea con ID ${id} no existe.`)
    return this.subareaRepository.update(id, name)
  }

  delete(id: number): void {
    const existing = this.subareaRepository.findById(id)
    if (!existing) throw new Error(`La subárea con ID ${id} no existe.`)
    this.subareaRepository.delete(id)
  }

  findOrCreate(name: string, areaId: number): Subarea {
    return this.subareaRepository.findOrCreate(name, areaId)
  }
}
