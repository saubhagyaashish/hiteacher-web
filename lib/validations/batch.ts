import { z } from 'zod';

export const batchSchema = z.object({
    name: z.string().min(2, { message: 'Batch name must be at least 2 characters' }),
    subject: z.string().min(1, { message: 'Subject is required' }),
    description: z.string().optional(),
    maxStudents: z.number().min(1).max(100).optional(),
    accessType: z.enum(['public', 'private', 'invite-only']).optional(),
    schedule: z.object({
        days: z.array(z.string()).min(1, { message: 'Select at least one day' }).optional(),
        startTime: z.string().min(1, { message: 'Start time is required' }),
        endTime: z.string().min(1, { message: 'End time is required' }),
    }).optional(),
})

export const addStudentToBatchSchema = z.object({
    studentId: z.string().min(1, { message: 'Student ID is required' }),
    batchId: z.string().min(1, { message: 'Batch ID is required' }),
})

export type BatchFormData = z.infer<typeof batchSchema>
export type AddStudentToBatchData = z.infer<typeof addStudentToBatchSchema>
