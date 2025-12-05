import { ClassSession, RecurringPattern } from '@/types/class'
import { addDays, addWeeks, setHours, setMinutes, getDay } from 'date-fns'
import { ClassSessionFormData } from '../validations/class'

/**
 * Generate multiple class sessions from a recurring pattern
 */
export function generateRecurringClasses(
    formData: ClassSessionFormData,
    teacherId: string,
    teacherName: string,
    batchName: string
): ClassSession[] {
    if (!formData.isRecurring || !formData.recurringPattern) {
        return []
    }

    const { recurringPattern } = formData
    const classes: ClassSession[] = []
    const recurringGroupId = generateRecurringGroupId()

    // Determine how many classes to generate
    const maxOccurrences = recurringPattern.occurrences || 52 // Default to 1 year if using end date
    let currentDate = new Date(formData.startTime)
    let occurrenceCount = 0

    while (occurrenceCount < maxOccurrences) {
        // Check if we've passed the end date
        if (recurringPattern.endDate && currentDate > recurringPattern.endDate) {
            break
        }

        // Generate class for this occurrence
        const shouldCreateClass = shouldCreateClassForDate(currentDate, recurringPattern, occurrenceCount)

        if (shouldCreateClass) {
            const endTime = calculateEndTime(currentDate, formData.duration)

            classes.push({
                id: generateClassId(),
                batchId: formData.batchId,
                batchName,
                teacherId,
                teacherName,
                title: formData.title,
                topic: formData.topic,
                description: formData.description,
                startTime: new Date(currentDate),
                endTime,
                duration: formData.duration,
                status: 'scheduled',
                meetingLink: formData.meetingLink,
                attendance: [],
                notes: formData.notes,
                isRecurring: true,
                recurringGroupId,
                recurringPattern,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            occurrenceCount++
        }

        // Move to next occurrence
        currentDate = getNextOccurrenceDate(currentDate, recurringPattern)
    }

    return classes
}

/**
 * Check if a class should be created for a specific date based on recurring pattern
 */
function shouldCreateClassForDate(
    date: Date,
    pattern: RecurringPattern,
    occurrenceCount: number
): boolean {
    if (pattern.type === 'daily') {
        return true
    }

    if (pattern.type === 'weekly' && pattern.daysOfWeek) {
        const dayOfWeek = getDay(date) // 0 = Sunday, 1 = Monday, etc.
        return pattern.daysOfWeek.includes(dayOfWeek)
    }

    return false
}

/**
 * Get the next occurrence date based on recurring pattern
 */
function getNextOccurrenceDate(currentDate: Date, pattern: RecurringPattern): Date {
    const interval = pattern.interval || 1

    if (pattern.type === 'daily') {
        return addDays(currentDate, interval)
    }

    if (pattern.type === 'weekly') {
        // For weekly, we need to check the next day until we find one in daysOfWeek
        if (!pattern.daysOfWeek || pattern.daysOfWeek.length === 0) {
            return addWeeks(currentDate, interval)
        }

        let nextDate = addDays(currentDate, 1)
        const maxDaysToCheck = 7 * interval

        for (let i = 0; i < maxDaysToCheck; i++) {
            const dayOfWeek = getDay(nextDate)
            if (pattern.daysOfWeek.includes(dayOfWeek)) {
                return nextDate
            }
            nextDate = addDays(nextDate, 1)
        }
    }

    return addDays(currentDate, 1)
}

/**
 * Calculate class end time from start time and duration
 */
export function calculateEndTime(startTime: Date, durationMinutes: number): Date {
    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + durationMinutes)
    return endTime
}

/**
 * Generate a unique class ID
 */
export function generateClassId(): string {
    return `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a unique recurring group ID
 */
export function generateRecurringGroupId(): string {
    return `recurring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a single class session from form data
 */
export function createClassFromFormData(
    formData: ClassSessionFormData,
    teacherId: string,
    teacherName: string,
    batchName: string
): ClassSession {
    const endTime = calculateEndTime(formData.startTime, formData.duration)

    return {
        id: generateClassId(),
        batchId: formData.batchId,
        batchName,
        teacherId,
        teacherName,
        title: formData.title,
        topic: formData.topic,
        description: formData.description,
        startTime: formData.startTime,
        endTime,
        duration: formData.duration,
        status: 'scheduled',
        meetingLink: formData.meetingLink,
        attendance: [],
        notes: formData.notes,
        isRecurring: formData.isRecurring,
        recurringPattern: formData.recurringPattern,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
}

/**
 * Check if a class is upcoming (in the future)
 */
export function isClassUpcoming(classSession: ClassSession): boolean {
    return classSession.startTime > new Date() && classSession.status === 'scheduled'
}

/**
 * Check if a class is today
 */
export function isClassToday(classSession: ClassSession): boolean {
    const today = new Date()
    const classDate = new Date(classSession.startTime)

    return (
        classDate.getDate() === today.getDate() &&
        classDate.getMonth() === today.getMonth() &&
        classDate.getFullYear() === today.getFullYear()
    )
}

/**
 * Check if a class is within N minutes of starting
 */
export function isClassStartingSoon(classSession: ClassSession, minutesBefore: number = 15): boolean {
    const now = new Date()
    const timeDiff = classSession.startTime.getTime() - now.getTime()
    const minutesDiff = timeDiff / (1000 * 60)

    return minutesDiff >= 0 && minutesDiff <= minutesBefore
}

/**
 * Format class duration for display
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
        return `${hours} hr${hours > 1 ? 's' : ''}`
    }

    return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`
}
