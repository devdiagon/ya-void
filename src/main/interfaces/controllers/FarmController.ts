import { Farm } from '../../core/entities/Farm'
import { UseFarm } from '../../core/use-cases/UseFarm'
import { FarmRepository } from '../../data/repositories/FarmRepository'

export class FarmController {
  private useFarm: UseFarm

  constructor(private farmRepository: FarmRepository) {
    this.useFarm = new UseFarm(this.farmRepository)
  }

  async list(): Promise<Farm[]> {
    return this.useFarm.getAll()
  }

  async getById(id: number): Promise<Farm> {
    return this.useFarm.getById(id)
  }

  async create(payload: { name: string }): Promise<Farm> {
    return this.useFarm.create(payload.name)
  }

  async update(id: number, payload: { name: string }): Promise<void> {
    return this.useFarm.update(id, payload.name)
  }

  async delete(id: number): Promise<void> {
    return this.useFarm.delete(id)
  }
}
