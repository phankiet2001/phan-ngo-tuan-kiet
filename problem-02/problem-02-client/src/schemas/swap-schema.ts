import { z } from "zod";
export const swapSchema = z.object({
  from: z.object({
    currency: z.string(),
    amount: z.number().min(0)
  }),
  to: z.object({
    currency: z.string(),
    amount: z.number().min(0),
  }),
});

export type SwapSchema = z.infer<typeof swapSchema>;
