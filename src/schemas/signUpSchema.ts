import { z } from "zod/v4";

export const signUpSchema = z
  .object({
    email: z.email("invalid email").nonempty("email is required"),
    password: z
      .string("password is required")
      .min(8, { error: "password should have minimun length 8." })
      .max(100, { error: "password should be less than of length 100." }),
    confirmPassword: z
      .string("confirmPassword is required")
      .min(8, { error: "password should have minimun length 8." })
      .max(100, { error: "password should be less than of length 100." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "password and confirm password are different.",
    path: ["confirmPassword"],
  });
