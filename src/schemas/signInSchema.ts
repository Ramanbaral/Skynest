import { z } from "zod/v4";

export const signInSchema = z.object({
  email: z.email("invalid email").nonempty("email is required"),
  password: z
    .string("password is required")
    .min(8, { error: "password should have minimun length 8." })
    .max(100, { error: "password should be less than of length 100." }),
});
