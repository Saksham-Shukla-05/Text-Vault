import { z } from "zod";

export const signInSchema = z.object({
  Identifier: z.string(), //email
  password: z.string(),
});
