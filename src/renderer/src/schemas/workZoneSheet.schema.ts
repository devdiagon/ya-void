import * as z from 'zod';

export const WorkZoneSheetSchema = z.object({
  name: z.string().optional(),
  areaId: z.number({ message: 'Seleccione un área' }).min(1, 'Seleccione un área')
});

export type WorkZoneSheetFormData = z.infer<typeof WorkZoneSheetSchema>;
