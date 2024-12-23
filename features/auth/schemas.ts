import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Required')
})


export const SignUpFormSchema = z.object({
    name: z.string().min(1, 'Required'),
    email: z.string().email(),
    password: z.string().min(8, 'Minimum of 8 characters')
})