import { WorkZone } from '../../core/entities/WorkZone'
import { UseWorkZone } from '../../core/use-cases/UseWorkZone'
import { WorkZoneRepository } from '../../data/repositories/WorkZoneRepository'

export class WorkZoneController {
  private useWorkZone: UseWorkZone

  constructor(private workZoneRepository: WorkZoneRepository) {
    this.useWorkZone = new UseWorkZone(this.workZoneRepository)
  }

  async listWorkZones(): Promise<WorkZone[]> {
    return this.useWorkZone.getAll()
  }

  async getWorkZoneById(id: number): Promise<WorkZone> {
    return this.useWorkZone.getById(id)
  }

  async createWorkZone(payload: {
    name: string
    startDate: string
    endDate: string
  }): Promise<WorkZone> {
    return this.useWorkZone.create(payload)
  }

  async updateWorkZone(
    id: number,
    payload: {
      name: string
      startDate: string
      endDate: string
    }
  ): Promise<void> {
    return this.useWorkZone.update({
      id,
      name: payload.name,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate)
    })
  }

  async deleteWorkZone(id: number): Promise<void> {
    return this.useWorkZone.delete(id)
  }
}
