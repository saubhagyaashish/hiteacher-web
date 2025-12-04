import { z } from 'zod'

// Subject validation
export const subjectSchema = z.object({
    name: z.string().min(2, 'Subject name must be at least 2 characters').max(100, 'Name too long'),
    description: z.string().max(500, 'Description too long').optional(),
    icon: z.string().optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format (use hex: #RRGGBB)').optional(),
})

export type SubjectFormData = z.infer<typeof subjectSchema>

// Topic validation
export const topicSchema = z.object({
    name: z.string().min(2, 'Topic name must be at least 2 characters').max(100, 'Name too long'),
    description: z.string().max(500, 'Description too long').optional(),
    order: z.number().min(0),
})

export type TopicFormData = z.infer<typeof topicSchema>

// Chapter validation
export const chapterSchema = z.object({
    name: z.string().min(2, 'Chapter name must be at least 2 characters').max(100, 'Name too long'),
    description: z.string().max(500, 'Description too long').optional(),
    order: z.number().min(0),
    contentIds: z.array(z.string()),
})

export type ChapterFormData = z.infer<typeof chapterSchema>
