import { FarmRepository } from '../../data/repositories/FarmRepository'
import { Farm } from '../entities/Farm'

export class CreateFarm {
  constructor(private farmRepository: FarmRepository) {}

  execute(name: string): Farm {
    if (!name || name.trim() === '') {
      throw new Error('Farm name cannot be empty')
    }
    return this.farmRepository.create(name.trim())
  }
}
