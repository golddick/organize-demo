import {z } from 'zod'

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ]).optional(),
    workspaceID: z.string()
})


export const updateProjectSchema = z.object({
    name: z.string().min(1, 'Must b more than 1 characters').optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ]).optional(),
})