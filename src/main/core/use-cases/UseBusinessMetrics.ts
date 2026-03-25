import { MetricsRepository } from '../../data/repositories/MetricsRepository'
import { BusinessMetrics } from '../entities/BusinessMetrics'

export class UseBusinessMetrics {
  constructor(private metricsRepository: MetricsRepository) {}

  getBusinessMetrics(): BusinessMetrics {
    return this.metricsRepository.getBusinessMetrics()
  }
}
