import { TripRepository } from '../../data/repositories/TripRepository';
import { Trip, TripStatus } from '../entities/Trip';

const REQUIRED_FIELDS: { key: keyof Trip; label: string }[] = [
  { key: 'vehicleType', label: 'tipo de vehículo' },
  { key: 'tripDate', label: 'fecha del viaje' },
  { key: 'departureTime', label: 'hora de salida' },
  { key: 'arrivalTime', label: 'hora de llegada' },
  { key: 'passengerCount', label: 'cantidad de pasajeros' },
  { key: 'cost', label: 'costo' },
  { key: 'requesterId', label: 'solicitante' },
  { key: 'routeId', label: 'ruta' },
  { key: 'reasonId', label: 'motivo' }
]

export class UseTrip {
  constructor(private tripRepository: TripRepository) {}

  /**
   * Obtiene todos los viajes de una hoja de zona de trabajo.
   */
  getByWorkZoneSheet(workZoneSheetId: number): Trip[] {
    return this.tripRepository.findByWorkZoneSheetId(workZoneSheetId)
  }

  /**
   * Obtiene los viajes de una hoja filtrados por estado.
   */
  getByWorkZoneSheetAndStatus(workZoneSheetId: number, status: TripStatus): Trip[] {
    return this.tripRepository.findByWorkZoneSheetIdAndStatus(workZoneSheetId, status)
  }

  /**
   * Obtiene todos los viajes de un área.
   */
  getByArea(areaId: number): Trip[] {
    return this.tripRepository.findByAreaId(areaId)
  }

  /**
   * Obtiene viajes en un rango de fechas (para calendarios y reportes).
   */
  getByDateRange(from: string, to: string): Trip[] {
    return this.tripRepository.findByDateRange(from, to)
  }

  /**
   * Obtiene un viaje por su ID.
   */
  getById(id: number): Trip {
    const trip = this.tripRepository.findById(id)
    if (!trip) throw new Error(`El viaje con ID ${id} no existe.`)
    return trip
  }

  /**
   * Crea un nuevo viaje en estado 'pending'.
   * Todos los campos son opcionales — el status visual del frontend indicará
   * qué campos faltan para poder confirmar el viaje.
   */
  create(data: Omit<Trip, 'id' | 'status' | 'routeSnapshot' | 'reasonSnapshot'>): Trip {
    const newId = this.tripRepository.create(data)
    const created = this.tripRepository.findById(newId)
    if (!created) throw new Error('Error al crear el viaje.')
    return created
  }

  /**
   * Actualiza los campos operativos de un viaje en estado 'pending'.
   * No permite editar un viaje ya confirmado (ready) — debe reabrirse primero.
   */
  update(data: Trip): boolean {
    const existing = this.tripRepository.findById(data.id)
    if (!existing) throw new Error(`El viaje con ID ${data.id} no existe.`)
    if (existing.status === 'ready') {
      throw new Error('No se puede editar un viaje confirmado. Reábrelo primero.')
    }
    return this.tripRepository.update(data)
  }

  /**
   * Intenta confirmar un viaje (pending → ready).
   * Valida que todos los campos obligatorios estén completos antes de confirmar.
   * Devuelve los campos faltantes si la validación falla, en lugar de lanzar error,
   * para que el frontend pueda mostrarlos al usuario.
   */
  confirm(id: number): { success: true } | { success: false; missing: string[] } {
    const trip = this.tripRepository.findById(id)
    if (!trip) throw new Error(`El viaje con ID ${id} no existe.`)

    const missing = REQUIRED_FIELDS
      .filter(({ key }) => trip[key] === null || trip[key] === undefined)
      .map(({ label }) => label)

    if (missing.length > 0) return { success: false, missing }

    this.tripRepository.confirm(id)
    return { success: true }
  }

  /**
   * Reabre un viaje confirmado (ready → pending), limpiando sus snapshots.
   * Permite editar los datos antes de volver a confirmar.
   */
  reopen(id: number): boolean {
    const existing = this.tripRepository.findById(id)
    if (!existing) throw new Error(`El viaje con ID ${id} no existe.`)
    return this.tripRepository.reopen(id)
  }

  /**
   * Elimina un viaje.
   */
  delete(id: number): void {
    const existing = this.tripRepository.findById(id)
    if (!existing) throw new Error(`El viaje con ID ${id} no existe.`)
    this.tripRepository.delete(id)
  }
}
