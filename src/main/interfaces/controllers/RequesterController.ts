import { Requester } from '../../core/entities/Requester'
import { UseRequester } from '../../core/use-cases/UseRequester'
import { RequesterRepository } from '../../data/repositories/RequesterRepository'

export class RequesterController {
  private useRequester: UseRequester
  constructor(private requesterRepository: RequesterRepository) {
    this.useRequester = new UseRequester(this.requesterRepository)
  }

  async listAll(): Promise<Requester[]> {
    return this.useRequester.getAll()
  }

  async listByArea(areaId: number): Promise<Requester[]> {
    return this.useRequester.getByArea(areaId)
  }

  async listByFarm(farmId: number): Promise<Requester[]> {
    return this.useRequester.getByFarm(farmId)
  }

  async getById(id: number): Promise<Requester> {
    return this.useRequester.getById(id)
  }

  async create(payload: { name: string }): Promise<Requester> {
    return this.useRequester.create(payload.name)
  }

  async update(id: number, payload: { name: string }): Promise<Requester> {
    return this.useRequester.update(id, payload.name)
  }

  async delete(id: number): Promise<void> {
    return this.useRequester.delete(id)
  }

  // --- Métodos de Relación (Asignación a Áreas) ---

  async assignToArea(payload: { requesterId: number; areaId: number }): Promise<void> {
    return this.useRequester.assignToArea(payload.requesterId, payload.areaId)
  }

  async removeFromArea(payload: { requesterId: number; areaId: number }): Promise<void> {
    return this.useRequester.removeFromArea(payload.requesterId, payload.areaId)
  }
}
