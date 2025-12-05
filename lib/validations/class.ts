import { z } from 'zod'

// Meeting Link Schema
export const meetingLinkSchema = z.object({
    platform: z.enum(['zoom', 'google-meet', 'ms-teams', 'other']),
    url: z.string().url('Please enter a valid URL'),
    meetingId: z.string().optional(),
    password: z.string().optional(),
    notes: z.string().optional(),
})

// Recurring Pattern Schema
export const recurringPatternSchema = z.object({
    type: z.enum(['none', 'daily', 'weekly', 'custom']),
    interval: z.number().min(1).optional(),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    endDate: z.date().optional(),
    occurrences: z.number().min(1).max(365).optional(),
})

// Class Session Schema
export const classSessionSchema = z.object({
    batchId: z.string().min(1, 'Please select a batch'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    topic: z.string().min(3, 'Topic must be at least 3 characters'),
    description: z.string().optional(),
    startTime: z.coerce.date(),
    duration: z.number().min(15, 'Class must be at least 15 minutes').max(480, 'Class cannot exceed 8 hours'),
    meetingLink: meetingLinkSchema.optional(),
    isRecurring: z.boolean().default(false),
    recurringPattern: recurringPatternSchema.optional(),
    notes: z.string().optional(),
}).refine(
    (data) => {
        // If recurring, must have a pattern
        if (data.isRecurring && !data.recurringPattern) {
            return false
        }
        return true
    },
    {
        message: 'Recurring pattern is required for recurring classes',
        path: ['recurringPattern'],
    }
)

// Attendance Schema
export const attendanceRecordSchema = z.object({
    classId: z.string(),
    studentId: z.string(),
    status: z.enum(['present', 'absent', 'late', 'excused']),
    notes: z.string().optional(),
})

// Bulk Attendance Schema
export const bulkAttendanceSchema = z.object({
    classId: z.string(),
    attendance: z.array(attendanceRecordSchema),
})

// Class Edit Schema (allows partial updates)
export const classEditSchema = classSessionSchema.partial().extend({
    id: z.string(),
    updateSeries: z.boolean().optional(), // For recurring classes
})

// Types inferred from schemas
export type ClassSessionFormData = z.infer<typeof classSessionSchema>
export type AttendanceRecordFormData = z.infer<typeof attendanceRecordSchema>
export type BulkAttendanceFormData = z.infer<typeof bulkAttendanceSchema>
export type ClassEditFormData = z.infer<typeof classEditSchema>
export type MeetingLinkFormData = z.infer<typeof meetingLinkSchema>
