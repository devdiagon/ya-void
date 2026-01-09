import * as z from 'zod';

export const FarmSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, {
      message: 'El nombre no puede estar en blanco'
    })
});

export type FarmFormData = z.infer<typeof FarmSchema>;
