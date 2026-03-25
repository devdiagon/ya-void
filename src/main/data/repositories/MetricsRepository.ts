import {
    BusinessMetrics,
    FarmTripMetrics,
    GlobalTripMetrics,
    WorkZoneFarmTripMetrics,
    WorkZoneSheetDetailTotal,
    WorkZoneSheetTotals,
    WorkZoneSheetTotalsByFarm,
    WorkZoneTripMetrics
} from '../../core/entities/BusinessMetrics'
import { getDb } from '../db/database'

export class MetricsRepository {
  private db = getDb()

  private isoDateMonthsAgo(months: number): string {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setMonth(d.getMonth() - months)
    return d.toISOString().slice(0, 10)
  }

  private getGlobalTripMetrics(fromOneMonth: string, fromSixMonths: string): GlobalTripMetrics {
    const row = this.db
      .prepare<GlobalTripMetrics>(
        `SELECT
           SUM(CASE WHEN trip_date >= ? THEN 1 ELSE 0 END) AS totalLastMonth,
           SUM(CASE WHEN trip_date >= ? THEN 1 ELSE 0 END) AS totalLastSixMonths
         FROM trip
         WHERE status = 'ready'`
      )
      .get(fromOneMonth, fromSixMonths)

    return {
      totalLastMonth: row?.totalLastMonth ?? 0,
      totalLastSixMonths: row?.totalLastSixMonths ?? 0
    }
  }

  private getFarmTripMetrics(fromOneMonth: string, fromSixMonths: string): FarmTripMetrics[] {
    const rows = this.db
      .prepare<{
        farmId: number
        farmName: string
        tripsLastMonth: number
        tripsLastSixMonths: number
      }>(
        `SELECT
           f.id   AS farmId,
           f.name AS farmName,
           SUM(CASE WHEN t.trip_date >= ? THEN 1 ELSE 0 END) AS tripsLastMonth,
           SUM(CASE WHEN t.trip_date >= ? THEN 1 ELSE 0 END) AS tripsLastSixMonths
         FROM trip t
         JOIN area a ON a.id = t.area_id
         JOIN farm f ON f.id = a.farm_id
         WHERE t.status = 'ready'
         GROUP BY f.id, f.name
         ORDER BY f.name`
      )
      .all(fromOneMonth, fromSixMonths)

    return rows.map((r) => ({
      farmId: r.farmId,
      farmName: r.farmName,
      tripsLastMonth: r.tripsLastMonth ?? 0,
      tripsLastSixMonths: r.tripsLastSixMonths ?? 0
    }))
  }

  private getWorkZoneTripMetrics(): WorkZoneTripMetrics[] {
    const rows = this.db
      .prepare<{
        workZoneId: number
        farmWorkZoneId: number
        farmId: number
        farmName: string
        totalTrips: number
      }>(
        `SELECT
           wz.id        AS workZoneId,
           fwz.id       AS farmWorkZoneId,
           fwz.farm_id  AS farmId,
           f.name       AS farmName,
           COUNT(*)     AS totalTrips
         FROM trip t
         JOIN work_zone_sheet wzs ON wzs.id = t.work_zone_sheet_id AND wzs.deleted_at IS NULL
         JOIN farm_work_zone fwz   ON fwz.id = wzs.farm_work_zone_id AND fwz.deleted_at IS NULL
         JOIN work_zone wz        ON wz.id = fwz.work_zone_id AND wz.deleted_at IS NULL
         JOIN farm f              ON f.id = fwz.farm_id
         WHERE t.status = 'ready'
         GROUP BY wz.id, fwz.id, f.id
         ORDER BY wz.id, f.name`
      )
      .all()

    const byWz = new Map<number, WorkZoneTripMetrics>()

    rows.forEach((r) => {
      let item = byWz.get(r.workZoneId)
      if (!item) {
        item = { workZoneId: r.workZoneId, totalTrips: 0, farms: [] }
        byWz.set(r.workZoneId, item)
      }
      item.totalTrips += r.totalTrips ?? 0
      const farm: WorkZoneFarmTripMetrics = {
        farmWorkZoneId: r.farmWorkZoneId,
        farmId: r.farmId,
        farmName: r.farmName,
        totalTrips: r.totalTrips ?? 0
      }
      item.farms.push(farm)
    })

    return Array.from(byWz.values())
  }

  private getWorkZoneSheetTotals(): WorkZoneSheetTotals[] {
    const totalByWz = this.db
      .prepare<{
        workZoneId: number
        totalSheet: number
      }>(
        `SELECT wz.id AS workZoneId, SUM(wzs.total_sheet) AS totalSheet
         FROM work_zone_sheet wzs
         JOIN farm_work_zone fwz ON fwz.id = wzs.farm_work_zone_id AND fwz.deleted_at IS NULL
         JOIN work_zone wz ON wz.id = fwz.work_zone_id AND wz.deleted_at IS NULL
         WHERE wzs.deleted_at IS NULL
         GROUP BY wz.id`
      )
      .all()

    const totalByFarm = this.db
      .prepare<{
        workZoneId: number
        farmWorkZoneId: number
        farmId: number
        farmName: string
        totalSheet: number
      }>(
        `SELECT
           wz.id        AS workZoneId,
           fwz.id       AS farmWorkZoneId,
           fwz.farm_id  AS farmId,
           f.name       AS farmName,
           SUM(wzs.total_sheet) AS totalSheet
         FROM work_zone_sheet wzs
         JOIN farm_work_zone fwz ON fwz.id = wzs.farm_work_zone_id AND fwz.deleted_at IS NULL
         JOIN work_zone wz ON wz.id = fwz.work_zone_id AND wz.deleted_at IS NULL
         JOIN farm f ON f.id = fwz.farm_id
         WHERE wzs.deleted_at IS NULL
         GROUP BY wz.id, fwz.id, f.id
         ORDER BY wz.id, f.name`
      )
      .all()

    const bySheet = this.db
      .prepare<{
        workZoneId: number
        workZoneSheetId: number
        farmWorkZoneId: number
        areaId: number
        name: string
        totalSheet: number
      }>(
        `SELECT
           wz.id       AS workZoneId,
           wzs.id      AS workZoneSheetId,
           fwz.id      AS farmWorkZoneId,
           wzs.area_id AS areaId,
           wzs.name    AS name,
           wzs.total_sheet AS totalSheet
         FROM work_zone_sheet wzs
         JOIN farm_work_zone fwz ON fwz.id = wzs.farm_work_zone_id AND fwz.deleted_at IS NULL
         JOIN work_zone wz ON wz.id = fwz.work_zone_id AND wz.deleted_at IS NULL
         WHERE wzs.deleted_at IS NULL
         ORDER BY wz.id, wzs.name`
      )
      .all()

    const map = new Map<number, WorkZoneSheetTotals>()

    totalByWz.forEach((row) => {
      map.set(row.workZoneId, {
        workZoneId: row.workZoneId,
        totalSheet: row.totalSheet ?? 0,
        byFarm: [],
        bySheet: []
      })
    })

    totalByFarm.forEach((row) => {
      const entry = map.get(row.workZoneId)
      if (!entry) return
      const item: WorkZoneSheetTotalsByFarm = {
        farmWorkZoneId: row.farmWorkZoneId,
        farmId: row.farmId,
        farmName: row.farmName,
        totalSheet: row.totalSheet ?? 0
      }
      entry.byFarm.push(item)
    })

    bySheet.forEach((row) => {
      const entry = map.get(row.workZoneId)
      if (!entry) return
      const item: WorkZoneSheetDetailTotal = {
        workZoneSheetId: row.workZoneSheetId,
        farmWorkZoneId: row.farmWorkZoneId,
        areaId: row.areaId,
        name: row.name,
        totalSheet: row.totalSheet ?? 0
      }
      entry.bySheet.push(item)
    })

    return Array.from(map.values())
  }

  getBusinessMetrics(): BusinessMetrics {
    const fromOneMonth = this.isoDateMonthsAgo(1)
    const fromSixMonths = this.isoDateMonthsAgo(6)

    const globalTrips = this.getGlobalTripMetrics(fromOneMonth, fromSixMonths)
    const farmTrips = this.getFarmTripMetrics(fromOneMonth, fromSixMonths)
    const workZoneTrips = this.getWorkZoneTripMetrics()
    const workZoneSheets = this.getWorkZoneSheetTotals()

    return { globalTrips, farmTrips, workZoneTrips, workZoneSheets }
  }
}
