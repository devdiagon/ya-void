import * as z from 'zod';

export const FarmWorkZoneSchema = z.object({
  farmId: z.number({ message: 'Seleccione una finca' }).min(1, 'Seleccione una finca'),
  name: z.string().optional()
});

export type FarmWorkZoneFormData = z.infer<typeof FarmWorkZoneSchema>;
