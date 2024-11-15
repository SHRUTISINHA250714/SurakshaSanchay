import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
export const LoginSchema = z.object({
  govId: z.string().min(1, {
    message: "Government ID is required",
  }),
  email: z.string().email({
    message: "govId is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  number: z
    .string()
    .min(10, {
      message: "Phone number should be at least 10 digits",
    })
    .max(15, {
      message: "Phone number should be at most 15 digits",
    }),
  role: z.string({
    message: "Invalid role",
  }),
  govId: z.string().min(1, {
    message: "Government ID is required",
  }),
  location: z.string().min(1, {
    message: "Location is required",
  }),
});
