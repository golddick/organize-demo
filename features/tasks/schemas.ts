import {z } from 'zod'
import { TaskStatus } from './types'

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    status: z.nativeEnum(TaskStatus, {required_error: 'Required'}),
    workspaceID: z.string().trim().min(1, 'Required'),
    projectID: z.string().trim().min(1, 'Required'),
    assigneeID: z.string().trim().min(1, 'Required'),
    description: z.string().trim().optional(),
    dueDate: z.coerce.date().refine(value => !isNaN(value.getTime()), {
        message: 'Invalid due date and time'
    }),
})
export const updateTaskSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    status: z.nativeEnum(TaskStatus, {required_error: 'Required'}),
    workspaceID: z.string().trim().min(1, 'Required'),
    projectID: z.string().trim().min(1, 'Required'),
    assigneeID: z.string().trim().min(1, 'Required'),
    description: z.string().trim().optional(),
    dueDate: z.coerce.date().refine(value => !isNaN(value.getTime()), {
        message: 'Invalid due date and time'
    }),
})


