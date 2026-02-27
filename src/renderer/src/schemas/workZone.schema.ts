import * as z from 'zod';

export const WorkZoneSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es obligatorio')
      .transform((value) => value.trim())
      .refine((value) => value.length > 0, {
        message: 'El nombre no puede estar en blanco'
      }),
    startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
    endDate: z.string().min(1, 'La fecha de fin es obligatoria')
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'La fecha de inicio no puede ser posterior a la fecha de fin',
    path: ['startDate']
  });

export type WorkZoneFormData = z.infer<typeof WorkZoneSchema>;
