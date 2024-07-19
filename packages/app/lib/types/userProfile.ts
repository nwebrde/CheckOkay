import {z} from "zod";

export const ZProfile = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  image: z.string().optional()
});

export type Profile = z.infer<typeof ZProfile>;