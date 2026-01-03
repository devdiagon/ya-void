import { FarmRepository } from '../../data/repositories/FarmRepository'
import { Farm } from '../entities/Farm'

export class GetFarms {
  constructor(private farmRepository: FarmRepository) {}

  execute(): Farm[] {
    return this.farmRepository.findAll()
  }
}
