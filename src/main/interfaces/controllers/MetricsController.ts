import { BusinessMetrics } from '../../core/entities/BusinessMetrics'
import { UseBusinessMetrics } from '../../core/use-cases/UseBusinessMetrics'
import { MetricsRepository } from '../../data/repositories/MetricsRepository'

export class MetricsController {
  private useBusinessMetrics: UseBusinessMetrics

  constructor(private metricsRepository: MetricsRepository) {
    this.useBusinessMetrics = new UseBusinessMetrics(this.metricsRepository)
  }

  async getBusinessMetrics(): Promise<BusinessMetrics> {
    return this.useBusinessMetrics.getBusinessMetrics()
  }
}
