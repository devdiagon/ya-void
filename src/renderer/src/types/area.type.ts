export interface Area {
  id: number;
  name: string;
  farm_id: number;
  manager_name: string | null;
  manager_cid: string | null;
}

export interface FormAreaDTO {
  name: string;
  farmId: number;
  managerName?: string | null;
  managerCid?: string | null;
}
