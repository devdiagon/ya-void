export interface WorkZone {
  id: number;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
}

export interface FormWorkZoneDTO {
  name: string;
  startDate: string;
  endDate: string;
}
