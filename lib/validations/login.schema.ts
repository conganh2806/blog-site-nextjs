import { z } from "zod";

export const loginSchema = z.object({
    email: z.preprocess(
        (value) =>
            typeof value === "string"
                ? value.trim().toLowerCase()
                : value,
        z.email({
            error: "Enter a valid email address.",
        })
    ),

    password: z
        .string()
        .min(1, {
            error: "Enter your password.",
        }),
});

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormValues = z.output<typeof loginSchema>;