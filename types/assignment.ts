export type AssignmentType = 'text' | 'file' | 'link' | 'quiz'
export type AssignmentStatus = 'active' | 'closed' | 'draft'
export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'late'
export type GradingType = 'points' | 'passfail'

export interface Assignment {
    id: string
    title: string
    description: string
    instructions: string // Rich text
    type: AssignmentType
    status: AssignmentStatus

    // Grading
    gradingType: GradingType
    maxPoints: number
    passingScore?: number

    // Scheduling
    dueDate: Date
    assignedDate: Date
    allowLateSubmission: boolean

    // Assignment scope
    batchIds: string[]

    // Attachments (teacher provided)
    attachments?: AssignmentAttachment[]

    // Linked learning content
    linkedContentIds?: string[]

    // Metadata
    teacherId: string
    createdAt: Date
    updatedAt: Date

    // Stats (computed)
    submissionCount?: number
    gradedCount?: number
}

export interface AssignmentAttachment {
    id: string
    fileName: string
    fileUrl: string
    fileSize: number
    fileType: string
}

export interface Submission {
    id: string
    assignmentId: string
    studentId: string
    studentName: string

    // Submission content
    type: AssignmentType
    textContent?: string // For text submissions
    fileUrl?: string // For file submissions
    fileName?: string
    fileSize?: number
    linkUrl?: string // For link submissions

    // Status and timing
    status: SubmissionStatus
    submittedAt: Date
    isLate: boolean

    // Grading
    grade?: number
    maxPoints: number
    feedback?: string
    gradedAt?: Date
    gradedBy?: string

    // Versioning
    version: number
    previousVersions?: string[] // IDs of previous submissions
}

export interface AssignmentFilters {
    search?: string
    status?: AssignmentStatus | 'all'
    batch?: string | 'all'
    dueDate?: 'upcoming' | 'overdue' | 'all'
    type?: AssignmentType | 'all'
}

export interface SubmissionFilters {
    status?: SubmissionStatus | 'all'
    student?: string
    graded?: boolean | 'all'
}

export interface AssignmentStats {
    total: number
    active: number
    closed: number
    draft: number

    // Submission stats
    totalSubmissions: number
    pendingReview: number
    graded: number
    lateSubmissions: number

    // Grade stats
    averageGrade?: number
    passingRate?: number
}

export interface StudentAssignmentView extends Assignment {
    mySubmission?: Submission
    isOverdue: boolean
    canSubmit: boolean
}

export type ViewMode = 'grid' | 'list'
