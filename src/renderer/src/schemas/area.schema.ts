import * as z from 'zod';

export const AreaSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, {
      message: 'El nombre no puede estar en blanco'
    }),
  managerName: z.string().trim().optional().nullable(),
  managerCid: z.string().trim().optional().nullable()
});

export type AreaFormData = z.infer<typeof AreaSchema>;
