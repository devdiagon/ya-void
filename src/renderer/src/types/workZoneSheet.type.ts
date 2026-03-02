export interface WorkZoneSheet {
  id: number;
  name: string;
  farmWorkZoneId: number;
  areaId: number;
  totalSheet: number;
}

export interface FormWorkZoneSheetDTO {
  name: string;
  farmWorkZoneId: number;
  areaId: number;
  totalSheet: number;
}
