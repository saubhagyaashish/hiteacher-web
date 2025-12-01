import { z } from 'zod';

export const batchSchema = z.object({
    name: z.string().min(2, 'Batch name must be at least 2 characters'),
    description: z.string().optional(),
    subject: z.string().min(1, 'Please select a subject'),
    teacherIds: z.array(z.string()).min(1, 'Please assign at least one teacher'),
    startDate: z.date({
        message: 'Please select a start date',
    }),
    endDate: z.date().optional(),
    schedule: z.string().optional(),
    maxStudents: z.number().min(1, 'Minimum 1 student required').optional(),
});

export const addStudentToBatchSchema = z.object({
    studentIds: z.array(z.string()).min(1, 'Please select at least one student'),
    batchId: z.string().min(1, 'Batch ID is required'),
});

export type BatchFormData = z.infer<typeof batchSchema>;
export type AddStudentToBatchFormData = z.infer<typeof addStudentToBatchSchema>;
