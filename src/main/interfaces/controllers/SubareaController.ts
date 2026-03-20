import { Subarea } from '../../core/entities/Subarea'
import { UseSubarea } from '../../core/use-cases/UseSubarea'
import { SubareaRepository } from '../../data/repositories/SubareaRepository'

export class SubareaController {
  private useSubarea: UseSubarea

  constructor(private subareaRepository: SubareaRepository) {
    this.useSubarea = new UseSubarea(this.subareaRepository)
  }

  async listByArea(areaId: number): Promise<Subarea[]> {
    return this.useSubarea.getByArea(areaId)
  }

  async getById(id: number): Promise<Subarea> {
    return this.useSubarea.getById(id)
  }

  async create(payload: { name: string; areaId: number }): Promise<Subarea> {
    return this.useSubarea.create(payload.name, payload.areaId)
  }

  async update(id: number, payload: { name: string }): Promise<boolean> {
    return this.useSubarea.update(id, payload.name)
  }

  async delete(id: number): Promise<void> {
    return this.useSubarea.delete(id)
  }

  async findOrCreate(payload: { name: string; areaId: number }): Promise<Subarea> {
    return this.useSubarea.findOrCreate(payload.name, payload.areaId)
  }
}
