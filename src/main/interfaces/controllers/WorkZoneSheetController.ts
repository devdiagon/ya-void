import { WorkZoneSheet } from '../../core/entities/WorkZoneSheet'
import { UseWorkZoneSheet } from '../../core/use-cases/UseWorkZoneSheet'
import { WorkZoneSheetRepository } from '../../data/repositories/WorkZoneSheetRepository'

export class WorkZoneSheetController {
  private useWorkZoneSheet: UseWorkZoneSheet

  constructor(private workZoneSheetRepository: WorkZoneSheetRepository) {
    this.useWorkZoneSheet = new UseWorkZoneSheet(this.workZoneSheetRepository)
  }

  /**
   * Lista todas las hojas (presupuestos por área) de una FarmWorkZone específica.
   */
  async listByFarmWorkZone(farmWorkZoneId: number): Promise<WorkZoneSheet[]> {
    return this.useWorkZoneSheet.getSheetsByFarmWorkZone(farmWorkZoneId)
  }

  /**
   * Obtiene una hoja de trabajo específica por su ID.
   */
  async getById(id: number): Promise<WorkZoneSheet | null> {
    return this.useWorkZoneSheet.getSheetById(id)
  }

  /**
   * Crea una nueva hoja de presupuesto para un área.
   * El payload incluye: name, farmWorkZoneId, areaId y totalSheet.
   */
  async create(payload: Omit<WorkZoneSheet, 'id'>): Promise<WorkZoneSheet> {
    return this.useWorkZoneSheet.createSheet(payload)
  }

  /**
   * Actualiza los datos de la hoja de presupuesto (nombre o cupo total).
   */
  async update(payload: WorkZoneSheet): Promise<boolean> {
    return this.useWorkZoneSheet.updateSheet(payload)
  }

  /**
   * Elimina una hoja de presupuesto.
   */
  async delete(id: number): Promise<void> {
    return this.useWorkZoneSheet.deleteSheet(id)
  }
}
