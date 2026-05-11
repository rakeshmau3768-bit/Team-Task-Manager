const { z } = require("zod");

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: z.enum(["admin", "user"], {
    errorMap: () => ({
      message: "Role must be either admin or user",
    }),
  }),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required"),

  role: z
    .enum(["admin", "user"])
    .optional(),
});

module.exports = {
  signupSchema,
  loginSchema,
};