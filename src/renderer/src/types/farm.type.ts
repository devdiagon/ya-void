export interface Farm {
  id: number;
  name: string;
}

export interface CreateFarmDTO {
  name: string;
}

export interface UpdateFarmDTO extends Partial<CreateFarmDTO> {
  id: string;
}
