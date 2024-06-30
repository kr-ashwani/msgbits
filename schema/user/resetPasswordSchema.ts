import { object, string, TypeOf } from "zod";

export const resetPasswordSchema = object({
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be of 6 characters minimum"),
    confirmPassword: string({
      required_error: "confirmPassword is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "confirmPassword did not match",
    path: ["confirmPassword"],
  }),
});

export type IresetPassword = TypeOf<typeof resetPasswordSchema>;
