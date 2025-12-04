import { create } from 'zustand'
import { Assignment, Submission, AssignmentFilters, SubmissionFilters, AssignmentStats } from '@/types/assignment'
import { mockAssignments, mockSubmissions } from '@/lib/mock-data/assignments'

interface AssignmentStore {
    // State
    assignments: Assignment[]
    submissions: Submission[]
    filters: AssignmentFilters
    submissionFilters: SubmissionFilters

    // Assignment Actions
    setAssignments: (assignments: Assignment[]) => void
    addAssignment: (assignment: Assignment) => void
    updateAssignment: (id: string, updates: Partial<Assignment>) => void
    deleteAssignment: (id: string) => void
    duplicateAssignment: (id: string) => void

    // Submission Actions
    addSubmission: (submission: Submission) => void
    updateSubmission: (id: string, updates: Partial<Submission>) => void
    gradeSubmission: (id: string, grade: number, feedback?: string) => void

    // Filter Actions
    setFilters: (filters: Partial<AssignmentFilters>) => void
    setSubmissionFilters: (filters: Partial<SubmissionFilters>) => void
    resetFilters: () => void

    // Computed/Helper Functions
    getFilteredAssignments: () => Assignment[]
    getAssignmentById: (id: string) => Assignment | undefined
    getSubmissionsByAssignment: (assignmentId: string) => Submission[]
    getSubmissionsByStudent: (studentId: string) => Submission[]
    getStudentSubmission: (assignmentId: string, studentId: string) => Submission | undefined
    getStats: () => AssignmentStats
    getAssignmentStats: (assignmentId: string) => {
        total: number
        submitted: number
        graded: number
        pending: number
        late: number
        averageGrade?: number
    }
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
    // Initial state
    assignments: mockAssignments,
    submissions: mockSubmissions,
    filters: {
        search: '',
        status: 'all',
        batch: 'all',
        dueDate: 'all',
        type: 'all',
    },
    submissionFilters: {
        status: 'all',
        graded: 'all',
    },

    // Assignment Actions
    setAssignments: (assignments) => set({ assignments }),

    addAssignment: (newAssignment) => set((state) => ({
        assignments: [newAssignment, ...state.assignments]
    })),

    updateAssignment: (id, updates) => set((state) => ({
        assignments: state.assignments.map(a =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
        )
    })),

    deleteAssignment: (id) => set((state) => ({
        assignments: state.assignments.filter(a => a.id !== id),
        submissions: state.submissions.filter(s => s.assignmentId !== id),
    })),

    duplicateAssignment: (id) => set((state) => {
        const original = state.assignments.find(a => a.id === id)
        if (!original) return state

        const duplicate: Assignment = {
            ...original,
            id: `assignment-${Date.now()}`,
            title: `${original.title} (Copy)`,
            status: 'draft',
            assignedDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            submissionCount: 0,
            gradedCount: 0,
        }

        return { assignments: [duplicate, ...state.assignments] }
    }),

    // Submission Actions
    addSubmission: (newSubmission) => set((state) => {
        // Update assignment submission count
        const updatedAssignments = state.assignments.map(a => {
            if (a.id === newSubmission.assignmentId) {
                return {
                    ...a,
                    submissionCount: (a.submissionCount || 0) + 1
                }
            }
            return a
        })

        return {
            submissions: [newSubmission, ...state.submissions],
            assignments: updatedAssignments
        }
    }),

    updateSubmission: (id, updates) => set((state) => ({
        submissions: state.submissions.map(s =>
            s.id === id ? { ...s, ...updates } : s
        )
    })),

    gradeSubmission: (id, grade, feedback) => set((state) => {
        const updatedSubmissions = state.submissions.map(s =>
            s.id === id ? {
                ...s,
                grade,
                feedback,
                status: 'graded' as const,
                gradedAt: new Date(),
            } : s
        )

        // Update assignment graded count
        const submission = state.submissions.find(s => s.id === id)
        const updatedAssignments = state.assignments.map(a => {
            if (a.id === submission?.assignmentId) {
                return {
                    ...a,
                    gradedCount: (a.gradedCount || 0) + 1
                }
            }
            return a
        })

        return {
            submissions: updatedSubmissions,
            assignments: updatedAssignments
        }
    }),

    // Filter Actions
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),

    setSubmissionFilters: (newFilters) => set((state) => ({
        submissionFilters: { ...state.submissionFilters, ...newFilters }
    })),

    resetFilters: () => set({
        filters: {
            search: '',
            status: 'all',
            batch: 'all',
            dueDate: 'all',
            type: 'all',
        },
        submissionFilters: {
            status: 'all',
            graded: 'all',
        }
    }),

    // Computed/Helper Functions
    getFilteredAssignments: () => {
        const { assignments, filters } = get()

        return assignments.filter(assignment => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchesSearch =
                    assignment.title.toLowerCase().includes(searchLower) ||
                    assignment.description.toLowerCase().includes(searchLower)
                if (!matchesSearch) return false
            }

            // Status filter
            if (filters.status && filters.status !== 'all') {
                if (assignment.status !== filters.status) return false
            }

            // Batch filter
            if (filters.batch && filters.batch !== 'all') {
                if (!assignment.batchIds.includes(filters.batch)) return false
            }

            // Type filter
            if (filters.type && filters.type !== 'all') {
                if (assignment.type !== filters.type) return false
            }

            // Due date filter
            if (filters.dueDate && filters.dueDate !== 'all') {
                const now = new Date()
                const dueDate = new Date(assignment.dueDate)

                if (filters.dueDate === 'upcoming') {
                    if (dueDate <= now) return false
                } else if (filters.dueDate === 'overdue') {
                    if (dueDate >= now) return false
                }
            }

            return true
        })
    },

    getAssignmentById: (id) => {
        return get().assignments.find(a => a.id === id)
    },

    getSubmissionsByAssignment: (assignmentId) => {
        return get().submissions.filter(s => s.assignmentId === assignmentId)
    },

    getSubmissionsByStudent: (studentId) => {
        return get().submissions.filter(s => s.studentId === studentId)
    },

    getStudentSubmission: (assignmentId, studentId) => {
        return get().submissions.find(
            s => s.assignmentId === assignmentId && s.studentId === studentId
        )
    },

    getStats: () => {
        const { assignments, submissions } = get()

        const totalSubmissions = submissions.length
        const gradedSubmissions = submissions.filter(s => s.status === 'graded')
        const lateSubmissions = submissions.filter(s => s.isLate)

        const grades = gradedSubmissions
            .filter(s => s.grade !== undefined)
            .map(s => s.grade!)

        const averageGrade = grades.length > 0
            ? grades.reduce((a, b) => a + b, 0) / grades.length
            : undefined

        const passingGrades = gradedSubmissions.filter(s => {
            const assignment = assignments.find(a => a.id === s.assignmentId)
            if (!assignment || s.grade === undefined) return false

            if (assignment.gradingType === 'passfail' && assignment.passingScore) {
                return s.grade >= assignment.passingScore
            }
            return s.grade >= (assignment.maxPoints * 0.6) // Default 60% passing
        })

        const passingRate = gradedSubmissions.length > 0
            ? (passingGrades.length / gradedSubmissions.length) * 100
            : undefined

        return {
            total: assignments.length,
            active: assignments.filter(a => a.status === 'active').length,
            closed: assignments.filter(a => a.status === 'closed').length,
            draft: assignments.filter(a => a.status === 'draft').length,
            totalSubmissions,
            pendingReview: submissions.filter(s => s.status === 'submitted').length,
            graded: gradedSubmissions.length,
            lateSubmissions: lateSubmissions.length,
            averageGrade,
            passingRate,
        }
    },

    getAssignmentStats: (assignmentId) => {
        const submissions = get().submissions.filter(s => s.assignmentId === assignmentId)

        const submitted = submissions.filter(s =>
            s.status === 'submitted' || s.status === 'graded'
        )
        const graded = submissions.filter(s => s.status === 'graded')
        const pending = submissions.filter(s => s.status === 'submitted')
        const late = submissions.filter(s => s.isLate)

        const grades = graded
            .filter(s => s.grade !== undefined)
            .map(s => s.grade!)

        const averageGrade = grades.length > 0
            ? grades.reduce((a, b) => a + b, 0) / grades.length
            : undefined

        return {
            total: submissions.length,
            submitted: submitted.length,
            graded: graded.length,
            pending: pending.length,
            late: late.length,
            averageGrade,
        }
    },
}))
