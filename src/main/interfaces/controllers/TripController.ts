import { Trip, TripStatus } from '../../core/entities/Trip'
import { UseTrip } from '../../core/use-cases/UseTrip'
import { TripPage, TripRepository, TripSearchParams } from '../../data/repositories/TripRepository'

export class TripController {
  private useTrip: UseTrip

  constructor(private tripRepository: TripRepository) {
    this.useTrip = new UseTrip(this.tripRepository)
  }

  async listAll(payload: TripSearchParams): Promise<TripPage> {
    return this.useTrip.getPaginated(payload)
  }

  async listByWorkZoneSheet(workZoneSheetId: number): Promise<Trip[]> {
    return this.useTrip.getByWorkZoneSheet(workZoneSheetId)
  }

  async listByWorkZoneSheetAndStatus(
    workZoneSheetId: number,
    status: TripStatus
  ): Promise<Trip[]> {
    return this.useTrip.getByWorkZoneSheetAndStatus(workZoneSheetId, status)
  }

  async listByArea(areaId: number): Promise<Trip[]> {
    return this.useTrip.getByArea(areaId)
  }

  async listByDateRange(payload: { from: string; to: string }): Promise<Trip[]> {
    return this.useTrip.getByDateRange(payload.from, payload.to)
  }

  async getById(id: number): Promise<Trip> {
    return this.useTrip.getById(id)
  }

  async create(
    payload: Omit<Trip, 'id' | 'status' | 'routeSnapshot' | 'reasonSnapshot'>
  ): Promise<Trip> {
    return this.useTrip.create(payload)
  }

  async update(payload: Trip): Promise<boolean> {
    return this.useTrip.update(payload)
  }

  async confirm(id: number): Promise<{ success: true } | { success: false; missing: string[] }> {
    return this.useTrip.confirm(id)
  }

  async reopen(id: number): Promise<boolean> {
    return this.useTrip.reopen(id)
  }

  async delete(id: number): Promise<void> {
    return this.useTrip.delete(id)
  }
}
