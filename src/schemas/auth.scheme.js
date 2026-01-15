import * as z from 'zod'

export const registerSchema = z.object({
    username: z.string("Username must be a string").trim().min(1, { message: "Username is required"}),
    email: z.email("Invalid email").trim(),
    password: z.string()
    .trim()
    .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter and one number"
        ),
})

export const loginSchema = z.object({
    email: z.email("User not found - (dev)email").trim(),
    password: z.string()
    .trim()
    .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "User not found - (dev)regex"
        ),
})
