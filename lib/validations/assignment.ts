import { z } from 'zod'

export const assignmentSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
    description: z.string().max(500, 'Description too long'),
    instructions: z.string().min(10, 'Instructions must be at least 10 characters'),
    type: z.enum(['text', 'file', 'link', 'quiz']),
    status: z.enum(['active', 'closed', 'draft']),

    gradingType: z.enum(['points', 'passfail']),
    maxPoints: z.number().min(1).max(1000),
    passingScore: z.number().min(0).optional(),

    dueDate: z.date(),
    assignedDate: z.date(),
    allowLateSubmission: z.boolean(),

    batchIds: z.array(z.string()).min(1, 'Select at least one batch'),

    attachments: z.array(z.object({
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number(),
        fileType: z.string(),
    })).optional(),
})

export type AssignmentFormData = z.infer<typeof assignmentSchema>

export const submissionSchema = z.object({
    assignmentId: z.string(),
    type: z.enum(['text', 'file', 'link', 'quiz']),

    // Content based on type
    textContent: z.string().min(10, 'Submission must be at least 10 characters').optional(),
    fileUrl: z.string().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    linkUrl: z.string().url('Please enter a valid URL').optional(),
}).refine((data) => {
    // Ensure at least one submission method is provided
    if (data.type === 'text' && !data.textContent) return false
    if (data.type === 'file' && !data.fileUrl) return false
    if (data.type === 'link' && !data.linkUrl) return false
    return true
}, {
    message: 'Please provide the required submission content',
})

export type SubmissionFormData = z.infer<typeof submissionSchema>

export const gradingSchema = z.object({
    submissionId: z.string(),
    grade: z.number().min(0),
    feedback: z.string().optional(),
})

export type GradingFormData = z.infer<typeof gradingSchema>

// File upload validation
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_SUBMISSION_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
]
