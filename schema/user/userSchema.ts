import { object, string, TypeOf } from "zod";

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

// validates req.body for new user
export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be of 6 characters minimum"),
    confirmPassword: string({
      required_error: "confirmPassword is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, "body.confirmPassword">;
