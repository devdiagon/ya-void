import { Requester } from '../../core/entities/Requester'

export type RequesterRow = {
  id: number
  name: string
  cid: string
}

export function mapRowToRequester(raw: RequesterRow): Requester {
  return {
    id: raw.id,
    name: raw.name,
    cid: raw.cid
  }
}
