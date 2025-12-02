import { z } from 'zod'

export const contentSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
    description: z.string().max(500, 'Description too long'),
    type: z.enum(['lesson', 'video', 'document', 'quiz']),
    category: z.string().min(1, 'Category is required'),
    tags: z.array(z.string()),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    fileUrl: z.string(),
    fileName: z.string(),
    fileSize: z.number(),
    duration: z.number().min(1).optional(),
    status: z.enum(['published', 'draft', 'scheduled']),
    scheduledAt: z.date().optional(),
    batchIds: z.array(z.string()).min(1, 'Select at least one batch'),
    commentsEnabled: z.boolean(),
    downloadEnabled: z.boolean(),
})

export type ContentFormData = z.infer<typeof contentSchema>

// Validation for file upload
export const fileUploadSchema = z.object({
    file: z.instanceof(File, { message: 'File is required' }),
    type: z.enum(['video', 'document']),
})

// Allowed file types
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/avi']
export const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
