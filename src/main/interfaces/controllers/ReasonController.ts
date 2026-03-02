import { Reason } from '../../core/entities/Reason'
import { UseReason } from '../../core/use-cases/UseReason'
import { ReasonRepository } from '../../data/repositories/ReasonRepository'

export class ReasonController {
  private useReason: UseReason

  constructor(private reasonRepository: ReasonRepository) {
    this.useReason = new UseReason(this.reasonRepository)
  }

  async listByArea(areaId: number): Promise<Reason[]> {
    return this.useReason.getByArea(areaId)
  }

  async getById(id: number): Promise<Reason> {
    return this.useReason.getById(id)
  }

  async create(payload: { name: string; areaId: number }): Promise<Reason> {
    return this.useReason.create(payload.name, payload.areaId)
  }

  async update(id: number, payload: { name: string }): Promise<boolean> {
    return this.useReason.update(id, payload.name)
  }

  async delete(id: number): Promise<void> {
    return this.useReason.delete(id)
  }
}
