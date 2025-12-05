import { create } from 'zustand'
import { ClassSession, AttendanceRecord, ClassFilters, ClassStats, AttendanceSummary, CalendarEvent } from '@/types/class'
import { mockClasses } from '@/lib/mock-data/classes'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, addDays, format } from 'date-fns'

interface ClassStore {
    // State
    classes: ClassSession[]
    filters: ClassFilters
    selectedClass: ClassSession | null
    calendarView: 'month' | 'week' | 'day' | 'list'

    // Actions
    setClasses: (classes: ClassSession[]) => void
    addClass: (classSession: ClassSession) => void
    updateClass: (id: string, updates: Partial<ClassSession>) => void
    deleteClass: (id: string) => void
    cancelClass: (id: string, cancelSeries?: boolean) => void
    setFilters: (filters: Partial<ClassFilters>) => void
    setCalendarView: (view: 'month' | 'week' | 'day' | 'list') => void
    setSelectedClass: (classSession: ClassSession | null) => void

    // CRUD operations
    createClass: (classSession: ClassSession) => void
    createRecurringClasses: (classes: ClassSession[]) => void
    updateClassWithSeries: (id: string, updates: Partial<ClassSession>, updateSeries?: boolean) => void
    deleteRecurringSeries: (recurringGroupId: string) => void

    // Class operations
    getClassById: (id: string) => ClassSession | undefined
    getFilteredClasses: () => ClassSession[]
    getClassesByBatch: (batchId: string) => ClassSession[]
    getClassesByDateRange: (startDate: Date, endDate: Date) => ClassSession[]
    getUpcomingClasses: (limit?: number) => ClassSession[]
    getTodayClasses: () => ClassSession[]
    getStats: () => ClassStats

    // Attendance operations
    markAttendance: (classId: string, attendance: AttendanceRecord[]) => void
    updateAttendance: (classId: string, studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => void
    getAttendanceSummary: (classId: string) => AttendanceSummary

    // Calendar operations
    getCalendarEvents: (month: Date) => CalendarEvent[]
}

export const useClassStore = create<ClassStore>((set, get) => ({
    // Initial state
    classes: mockClasses,
    filters: {
        search: '',
        batchId: 'all',
        status: 'all',
        dateRange: 'all',
    },
    selectedClass: null,
    calendarView: 'month',

    // Actions
    setClasses: (classes) => set({ classes }),

    addClass: (newClass) => set((state) => ({
        classes: [newClass, ...state.classes]
    })),

    updateClass: (id, updates) => set((state) => ({
        classes: state.classes.map(cls =>
            cls.id === id ? { ...cls, ...updates, updatedAt: new Date() } : cls
        ),
        selectedClass: state.selectedClass?.id === id
            ? { ...state.selectedClass, ...updates, updatedAt: new Date() }
            : state.selectedClass
    })),

    deleteClass: (id) => set((state) => ({
        classes: state.classes.filter(cls => cls.id !== id),
        selectedClass: state.selectedClass?.id === id ? null : state.selectedClass
    })),

    cancelClass: (id, cancelSeries = false) => set((state) => {
        if (cancelSeries) {
            const targetClass = state.classes.find(cls => cls.id === id)
            if (targetClass?.recurringGroupId) {
                // Cancel all classes in the series
                return {
                    classes: state.classes.map(cls =>
                        cls.recurringGroupId === targetClass.recurringGroupId
                            ? { ...cls, status: 'cancelled' as const, updatedAt: new Date() }
                            : cls
                    )
                }
            }
        }
        // Cancel single class
        return {
            classes: state.classes.map(cls =>
                cls.id === id ? { ...cls, status: 'cancelled' as const, updatedAt: new Date() } : cls
            )
        }
    }),

    // CRUD operations
    createClass: (newClass) => set((state) => ({
        classes: [newClass, ...state.classes]
    })),

    createRecurringClasses: (newClasses) => set((state) => ({
        classes: [...newClasses, ...state.classes]
    })),

    updateClassWithSeries: (id, updates, updateSeries = false) => set((state) => {
        if (updateSeries) {
            const targetClass = state.classes.find(cls => cls.id === id)
            if (targetClass?.recurringGroupId) {
                // Update all classes in the series
                return {
                    classes: state.classes.map(cls =>
                        cls.recurringGroupId === targetClass.recurringGroupId
                            ? { ...cls, ...updates, updatedAt: new Date() }
                            : cls
                    )
                }
            }
        }
        // Update single class
        return {
            classes: state.classes.map(cls =>
                cls.id === id ? { ...cls, ...updates, updatedAt: new Date() } : cls
            )
        }
    }),

    deleteRecurringSeries: (recurringGroupId) => set((state) => ({
        classes: state.classes.filter(cls => cls.recurringGroupId !== recurringGroupId)
    })),

    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),

    setCalendarView: (view) => set({ calendarView: view }),

    setSelectedClass: (classSession) => set({ selectedClass: classSession }),

    // Class queries
    getClassById: (id) => {
        const { classes } = get()
        return classes.find(cls => cls.id === id)
    },

    getFilteredClasses: () => {
        const { classes, filters } = get()

        return classes.filter(cls => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchesSearch =
                    cls.title.toLowerCase().includes(searchLower) ||
                    cls.topic.toLowerCase().includes(searchLower) ||
                    cls.batchName.toLowerCase().includes(searchLower)
                if (!matchesSearch) return false
            }

            // Batch filter
            if (filters.batchId && filters.batchId !== 'all') {
                if (cls.batchId !== filters.batchId) return false
            }

            // Status filter
            if (filters.status && filters.status !== 'all') {
                if (cls.status !== filters.status) return false
            }

            // Date range filter
            if (filters.dateRange && filters.dateRange !== 'all') {
                const now = new Date()
                const classDate = new Date(cls.startTime)

                switch (filters.dateRange) {
                    case 'today':
                        const todayStart = startOfDay(now)
                        const todayEnd = endOfDay(now)
                        if (!isWithinInterval(classDate, { start: todayStart, end: todayEnd })) return false
                        break
                    case 'week':
                        const weekStart = startOfWeek(now)
                        const weekEnd = endOfWeek(now)
                        if (!isWithinInterval(classDate, { start: weekStart, end: weekEnd })) return false
                        break
                    case 'month':
                        const monthStart = startOfMonth(now)
                        const monthEnd = endOfMonth(now)
                        if (!isWithinInterval(classDate, { start: monthStart, end: monthEnd })) return false
                        break
                    case 'custom':
                        if (filters.customStartDate && filters.customEndDate) {
                            if (!isWithinInterval(classDate, {
                                start: startOfDay(filters.customStartDate),
                                end: endOfDay(filters.customEndDate)
                            })) return false
                        }
                        break
                }
            }

            return true
        }).sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    },

    getClassesByBatch: (batchId) => {
        const { classes } = get()
        return classes.filter(cls => cls.batchId === batchId)
    },

    getClassesByDateRange: (startDate, endDate) => {
        const { classes } = get()
        return classes.filter(cls =>
            isWithinInterval(cls.startTime, { start: startDate, end: endDate })
        ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    },

    getUpcomingClasses: (limit = 5) => {
        const { classes } = get()
        const now = new Date()
        return classes
            .filter(cls => cls.startTime > now && cls.status === 'scheduled')
            .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
            .slice(0, limit)
    },

    getTodayClasses: () => {
        const { classes } = get()
        const todayStart = startOfDay(new Date())
        const todayEnd = endOfDay(new Date())
        return classes.filter(cls =>
            isWithinInterval(cls.startTime, { start: todayStart, end: todayEnd })
        ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    },

    getStats: () => {
        const { classes } = get()
        const now = new Date()
        const todayStart = startOfDay(now)
        const todayEnd = endOfDay(now)
        const weekEnd = endOfWeek(now)

        const todayClasses = classes.filter(cls =>
            isWithinInterval(cls.startTime, { start: todayStart, end: todayEnd })
        ).length

        const upcomingThisWeek = classes.filter(cls =>
            cls.startTime > now && cls.startTime <= weekEnd && cls.status === 'scheduled'
        ).length

        const completedClasses = classes.filter(cls => cls.status === 'completed')
        const totalAttendance = completedClasses.reduce((sum, cls) => {
            const summary = get().getAttendanceSummary(cls.id)
            return sum + summary.percentage
        }, 0)
        const avgAttendance = completedClasses.length > 0
            ? totalAttendance / completedClasses.length
            : 0

        return {
            total: classes.length,
            scheduled: classes.filter(cls => cls.status === 'scheduled').length,
            completed: classes.filter(cls => cls.status === 'completed').length,
            cancelled: classes.filter(cls => cls.status === 'cancelled').length,
            todayClasses,
            avgAttendance: Math.round(avgAttendance),
            upcomingThisWeek,
        }
    },

    // Attendance operations
    markAttendance: (classId, attendance) => set((state) => ({
        classes: state.classes.map(cls =>
            cls.id === classId ? { ...cls, attendance, updatedAt: new Date() } : cls
        )
    })),

    updateAttendance: (classId, studentId, status) => set((state) => ({
        classes: state.classes.map(cls => {
            if (cls.id === classId) {
                const existingIndex = cls.attendance.findIndex(a => a.studentId === studentId)
                let newAttendance = [...cls.attendance]

                if (existingIndex >= 0) {
                    // Update existing record
                    newAttendance[existingIndex] = {
                        ...newAttendance[existingIndex],
                        status,
                        markedAt: new Date()
                    }
                } else {
                    // Create new record
                    newAttendance.push({
                        id: `attendance-${classId}-${studentId}`,
                        classId,
                        studentId,
                        studentName: '', // Should be populated from student data
                        status,
                        markedAt: new Date()
                    })
                }

                return { ...cls, attendance: newAttendance, updatedAt: new Date() }
            }
            return cls
        })
    })),

    getAttendanceSummary: (classId) => {
        const { classes } = get()
        const classSession = classes.find(cls => cls.id === classId)

        if (!classSession) {
            return {
                totalStudents: 0,
                present: 0,
                absent: 0,
                late: 0,
                excused: 0,
                percentage: 0
            }
        }

        const totalStudents = classSession.attendance.length
        const present = classSession.attendance.filter(a => a.status === 'present').length
        const absent = classSession.attendance.filter(a => a.status === 'absent').length
        const late = classSession.attendance.filter(a => a.status === 'late').length
        const excused = classSession.attendance.filter(a => a.status === 'excused').length
        const percentage = totalStudents > 0
            ? Math.round((present / totalStudents) * 100)
            : 0

        return {
            totalStudents,
            present,
            absent,
            late,
            excused,
            percentage
        }
    },

    // Calendar operations
    getCalendarEvents: (month) => {
        const { classes } = get()
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(month)

        const batchColors: { [key: string]: string } = {
            'batch-1': '#3b82f6', // blue
            'batch-2': '#8b5cf6', // purple
            'batch-3': '#10b981', // green
            'batch-4': '#f59e0b', // amber
        }

        return classes
            .filter(cls =>
                isWithinInterval(cls.startTime, { start: monthStart, end: monthEnd })
            )
            .map(cls => ({
                id: cls.id,
                title: cls.title,
                start: cls.startTime,
                end: cls.endTime,
                batchId: cls.batchId,
                batchName: cls.batchName,
                color: batchColors[cls.batchId] || '#6b7280',
                status: cls.status,
                meetingLink: cls.meetingLink?.url
            }))
    },
}))
