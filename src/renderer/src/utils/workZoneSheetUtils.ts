import { WorkZoneSheetFormData } from '@renderer/schemas/workZoneSheet.schema';
import { Area, WorkZoneSheet } from '@renderer/types';

export const resolveName = (areas: Area[], data: WorkZoneSheetFormData) => {
  const trimmed = data.name?.trim();
  if (trimmed) return trimmed;
  return areas.find((a) => a.id === data.areaId)?.name ?? '';
};

export const checkActiveWorkZoneSheetsName = (
  workZoneSheets: WorkZoneSheet[],
  newSheetName: string
): boolean => {
  return workZoneSheets.some((workZoneSheet) => workZoneSheet.name.trim() === newSheetName);
};
