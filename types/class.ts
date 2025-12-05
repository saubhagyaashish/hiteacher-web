// Class Session Types
export type ClassStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type CalendarView = 'month' | 'week' | 'day' | 'list'
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'custom'
export type MeetingPlatform = 'zoom' | 'google-meet' | 'ms-teams' | 'other'

// Meeting Link Information
export interface MeetingLink {
    platform: MeetingPlatform
    url: string
    meetingId?: string
    password?: string
    notes?: string
}

// Attendance Record for a single student
export interface AttendanceRecord {
    id: string
    classId: string
    studentId: string
    studentName: string
    status: AttendanceStatus
    markedAt?: Date
    markedBy?: string
    notes?: string
}

// Recurring Schedule Pattern
export interface RecurringPattern {
    type: RecurrenceType
    interval?: number // For daily: every X days, for weekly: every X weeks
    daysOfWeek?: number[] // 0 = Sunday, 1 = Monday, etc. (for weekly)
    endDate?: Date
    occurrences?: number // Number of classes to generate
}

// Main Class Session Type
export interface ClassSession {
    id: string
    batchId: string
    batchName: string
    teacherId: string
    teacherName: string
    title: string
    topic: string
    description?: string
    startTime: Date
    endTime: Date
    duration: number // in minutes
    status: ClassStatus
    meetingLink?: MeetingLink
    attendance: AttendanceRecord[]
    notes?: string
    topicsCovered?: string[]
    homeworkAssigned?: string
    isRecurring: boolean
    recurringGroupId?: string // Links recurring classes together
    recurringPattern?: RecurringPattern
    createdAt: Date
    updatedAt: Date
}

// Class Filters for listing/searching
export interface ClassFilters {
    search: string
    batchId: string | 'all'
    status: ClassStatus | 'all'
    dateRange: 'today' | 'week' | 'month' | 'all' | 'custom'
    customStartDate?: Date
    customEndDate?: Date
    teacherId?: string
}

// Class Statistics
export interface ClassStats {
    total: number
    scheduled: number
    completed: number
    cancelled: number
    todayClasses: number
    avgAttendance: number
    upcomingThisWeek: number
}

// Attendance Summary
export interface AttendanceSummary {
    totalStudents: number
    present: number
    absent: number
    late: number
    excused: number
    percentage: number
}

// Calendar Event (for calendar display)
export interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    batchId: string
    batchName: string
    color: string
    status: ClassStatus
    meetingLink?: string
}

// Legacy types for backward compatibility if needed
export type Class = ClassSession
export type Attendance = AttendanceRecord
