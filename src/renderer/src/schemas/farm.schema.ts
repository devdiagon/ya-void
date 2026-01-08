import * as z from 'zod';

export const FarmSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio')
});

export type FarmFormData = z.infer<typeof FarmSchema>;
