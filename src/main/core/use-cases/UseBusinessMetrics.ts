import { BusinessMetrics } from '../entities/BusinessMetrics'
import { MetricsRepository } from '../../data/repositories/MetricsRepository'

export class UseBusinessMetrics {
  constructor(private metricsRepository: MetricsRepository) {}

  getBusinessMetrics(): BusinessMetrics {
    return this.metricsRepository.getBusinessMetrics()
  }
}
