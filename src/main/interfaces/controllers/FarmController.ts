import { Farm } from '../../core/entities/Farm'
import { CreateFarm } from '../../core/use-cases/CreateFarm'
import { GetFarms } from '../../core/use-cases/GetFarms'
import { FarmRepository } from '../../data/repositories/FarmRepository'

export class FarmController {
  private getFarms: GetFarms
  private createFarm: CreateFarm

  constructor(private farmRepository: FarmRepository) {
    this.getFarms = new GetFarms(this.farmRepository)
    this.createFarm = new CreateFarm(this.farmRepository)
  }

  async list(): Promise<Farm[]> {
    return this.getFarms.execute()
  }

  async create(payload: { name: string }): Promise<Farm> {
    return this.createFarm.execute(payload.name)
  }
}
