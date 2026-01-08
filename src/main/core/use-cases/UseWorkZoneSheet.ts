import { WorkZoneSheet } from '../../core/entities/WorkZoneSheet'
import { WorkZoneSheetRepository } from '../../data/repositories/WorkZoneSheetRepository'

export class UseWorkZoneSheet {
  private repository: WorkZoneSheetRepository

  constructor(repository: WorkZoneSheetRepository) {
    this.repository = repository
  }

  /**
   * Obtiene todas las hojas de presupuesto configuradas para una granja en una zona específica.
   */
  getSheetsByFarmWorkZone(farmWorkZoneId: number): WorkZoneSheet[] {
    return this.repository.findByFarmWorkZoneId(farmWorkZoneId)
  }

  /**
   * Obtiene el detalle de una hoja de trabajo por su ID.
   */
  getSheetById(id: number): WorkZoneSheet | null {
    return this.repository.findById(id)
  }

  /**
   * Crea una nueva hoja de presupuesto para un área.
   * @throws Error si la combinación de farmWorkZoneId y areaId ya existe.
   */
  createSheet(data: Omit<WorkZoneSheet, 'id'>): WorkZoneSheet {
    try {
      const newId = this.repository.create(data)
      return {
        ...data,
        id: newId
      }
    } catch {
      // Manejo de la restricción UNIQUE (farm_work_zone_id, area_id)
      throw new Error(
        `No se pudo crear: El área seleccionada ya tiene una hoja de trabajo asignada en esta zona.`
      )
    }
  }

  /**
   * Actualiza los valores de la hoja de trabajo (nombre o cantidad total).
   */
  updateSheet(data: WorkZoneSheet): boolean {
    const existing = this.repository.findById(data.id)
    if (!existing) {
      throw new Error(`La hoja de trabajo con ID ${data.id} no existe.`)
    }
    return this.repository.update(data)
  }

  /**
   * Elimina una hoja de trabajo.
   * Advertencia: Si hay viajes (trips) asociados, la DB podría impedir la eliminación.
   */
  deleteSheet(id: number): void {
    const existing = this.repository.findById(id)
    if (!existing) {
      throw new Error(`No se encontró la hoja de trabajo con ID ${id} para eliminar.`)
    }
    this.repository.delete(id)
  }
}
