import { Submission } from '@/types/assignment'
import { ClassSession, AttendanceRecord } from '@/types/class'
import { Content } from '@/types/content'
import { StudentProgress, BatchAnalytics, ChartData, ContentEngagement } from '@/types/analytics'
import { startOfWeek, endOfWeek, format, eachDayOfInterval, subDays } from 'date-fns'

/**
 * Calculate student performance metrics
 */
export function calculateStudentPerformance(
    studentId: string,
    submissions: Submission[],
    classes: ClassSession[],
    batchId?: string
): StudentProgress | null {
    // Filter submissions for this student
    const studentSubmissions = submissions.filter(s => s.studentId === studentId)

    if (studentSubmissions.length === 0) return null

    // Calculate average score
    const gradedSubmissions = studentSubmissions.filter(s => s.status === 'graded' && s.grade !== undefined)
    const averageScore = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
        : 0

    // Calculate attendance
    const studentClasses = classes.filter(cls =>
        cls.attendance.some(a => a.studentId === studentId)
    )
    const attendedClasses = studentClasses.filter(cls =>
        cls.attendance.some(a =>
            a.studentId === studentId &&
            (a.status === 'present' || a.status === 'late')
        )
    )
    const attendancePercentage = studentClasses.length > 0
        ? (attendedClasses.length / studentClasses.length) * 100
        : 0

    // Find last active date
    const lastSubmission = studentSubmissions.sort((a, b) =>
        b.submittedAt.getTime() - a.submittedAt.getTime()
    )[0]

    return {
        studentId,
        batchId: batchId || 'unknown',
        subjectId: 'unknown', // Would need to be passed in
        completionPercentage: (gradedSubmissions.length / studentSubmissions.length) * 100,
        contentViewed: 0, // Would need content tracking
        totalContent: 0,
        assignmentsCompleted: gradedSubmissions.length,
        totalAssignments: studentSubmissions.length,
        averageScore,
        attendance: attendancePercentage,
        lastActive: lastSubmission?.submittedAt || new Date()
    }
}

/**
 * Calculate batch analytics
 */
export function calculateBatchAnalytics(
    batchId: string,
    studentIds: string[],
    submissions: Submission[],
    classes: ClassSession[]
): BatchAnalytics {
    // Filter data for this batch
    const batchClasses = classes.filter(cls => cls.batchId === batchId)

    // Calculate average attendance
    const completedClasses = batchClasses.filter(cls => cls.status === 'completed')
    const totalStudentSlots = completedClasses.length * studentIds.length
    const totalPresent = completedClasses.reduce((sum, cls) => {
        return sum + cls.attendance.filter(a =>
            a.status === 'present' || a.status === 'late'
        ).length
    }, 0)
    const averageAttendance = totalStudentSlots > 0 ? (totalPresent / totalStudentSlots) * 100 : 0

    // Calculate average score
    const batchSubmissions = submissions.filter(s => studentIds.includes(s.studentId))
    const gradedSubmissions = batchSubmissions.filter(s => s.status === 'graded' && s.grade !== undefined)
    const averageScore = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
        : 0

    // Count active students (submitted in last 7 days)
    const sevenDaysAgo = subDays(new Date(), 7)
    const recentSubmissions = batchSubmissions.filter(s => s.submittedAt >= sevenDaysAgo)
    const activeStudents = new Set(recentSubmissions.map(s => s.studentId)).size

    return {
        batchId,
        totalStudents: studentIds.length,
        activeStudents,
        averageAttendance,
        averageScore,
        contentCount: 0, // Would need content data
        completedAssignments: gradedSubmissions.length,
        pendingAssignments: batchSubmissions.filter(s => s.status === 'submitted').length,
        engagementRate: (activeStudents / studentIds.length) * 100
    }
}

/**
 * Calculate grade distribution for charts
 */
export function calculateGradeDistribution(submissions: Submission[]): ChartData[] {
    const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.grade !== undefined)

    const distribution = {
        A: 0,  // 90-100
        B: 0,  // 80-89
        C: 0,  // 70-79
        D: 0,  // 60-69
        F: 0   // 0-59
    }

    gradedSubmissions.forEach(s => {
        const percentage = (s.grade! / s.maxPoints) * 100
        if (percentage >= 90) distribution.A++
        else if (percentage >= 80) distribution.B++
        else if (percentage >= 70) distribution.C++
        else if (percentage >= 60) distribution.D++
        else distribution.F++
    })

    return [
        { name: 'A (90-100%)', value: distribution.A, fill: '#10b981' },
        { name: 'B (80-89%)', value: distribution.B, fill: '#3b82f6' },
        { name: 'C (70-79%)', value: distribution.C, fill: '#f59e0b' },
        { name: 'D (60-69%)', value: distribution.D, fill: '#ef4444' },
        { name: 'F (0-59%)', value: distribution.F, fill: '#991b1b' }
    ]
}

/**
 * Calculate attendance distribution for pie chart
 */
export function calculateAttendanceDistribution(classes: ClassSession[]): ChartData[] {
    const completedClasses = classes.filter(cls => cls.status === 'completed')

    const distribution = {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0
    }

    completedClasses.forEach(cls => {
        cls.attendance.forEach(record => {
            distribution[record.status]++
        })
    })

    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)

    return [
        {
            name: 'Present',
            value: distribution.present,
            percentage: total > 0 ? ((distribution.present / total) * 100).toFixed(1) : '0',
            fill: '#10b981'
        },
        {
            name: 'Absent',
            value: distribution.absent,
            percentage: total > 0 ? ((distribution.absent / total) * 100).toFixed(1) : '0',
            fill: '#ef4444'
        },
        {
            name: 'Late',
            value: distribution.late,
            percentage: total > 0 ? ((distribution.late / total) * 100).toFixed(1) : '0',
            fill: '#f59e0b'
        },
        {
            name: 'Excused',
            value: distribution.excused,
            percentage: total > 0 ? ((distribution.excused / total) * 100).toFixed(1) : '0',
            fill: '#3b82f6'
        }
    ]
}

/**
 * Generate performance trend data over time
 */
export function generatePerformanceTrend(
    submissions: Submission[],
    days: number = 30
): ChartData[] {
    const endDate = new Date()
    const startDate = subDays(endDate, days)

    // Group submissions by day
    const submissionsByDay = new Map<string, Submission[]>()

    submissions.forEach(s => {
        if (s.status === 'graded' && s.gradedAt && s.gradedAt >= startDate) {
            const dateKey = format(s.gradedAt, 'MMM dd')
            if (!submissionsByDay.has(dateKey)) {
                submissionsByDay.set(dateKey, [])
            }
            submissionsByDay.get(dateKey)!.push(s)
        }
    })

    // Calculate average score for each day
    const trendData: ChartData[] = []
    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate })

    daysInterval.forEach(date => {
        const dateKey = format(date, 'MMM dd')
        const daySubs = submissionsByDay.get(dateKey) || []

        const avgScore = daySubs.length > 0
            ? daySubs.reduce((sum, s) => sum + ((s.grade || 0) / s.maxPoints) * 100, 0) / daySubs.length
            : 0

        trendData.push({
            name: dateKey,
            value: Math.round(avgScore),
            count: daySubs.length
        })
    })

    return trendData
}

/**
 * Generate attendance trend over time
 */
export function generateAttendanceTrend(
    classes: ClassSession[],
    days: number = 30
): ChartData[] {
    const endDate = new Date()
    const startDate = subDays(endDate, days)

    const completedClasses = classes.filter(cls =>
        cls.status === 'completed' && cls.startTime >= startDate
    )

    // Group by day
    const attendanceByDay = new Map<string, { present: number; total: number }>()

    completedClasses.forEach(cls => {
        const dateKey = format(cls.startTime, 'MMM dd')
        if (!attendanceByDay.has(dateKey)) {
            attendanceByDay.set(dateKey, { present: 0, total: 0 })
        }

        const dayData = attendanceByDay.get(dateKey)!
        dayData.total += cls.attendance.length
        dayData.present += cls.attendance.filter(a =>
            a.status === 'present' || a.status === 'late'
        ).length
    })

    // Calculate percentage for each day
    const trendData: ChartData[] = []
    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate })

    daysInterval.forEach(date => {
        const dateKey = format(date, 'MMM dd')
        const dayData = attendanceByDay.get(dateKey)

        const percentage = dayData && dayData.total > 0
            ? (dayData.present / dayData.total) * 100
            : 0

        trendData.push({
            name: dateKey,
            value: Math.round(percentage)
        })
    })

    return trendData
}

/**
 * Get top performing students
 */
export function getTopPerformers(
    studentProgressList: StudentProgress[],
    limit: number = 5
): StudentProgress[] {
    return studentProgressList
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, limit)
}

/**
 * Get students needing attention (low scores or attendance)
 */
export function getStudentsNeedingAttention(
    studentProgressList: StudentProgress[],
    scoreThreshold: number = 60,
    attendanceThreshold: number = 75
): StudentProgress[] {
    return studentProgressList.filter(s =>
        s.averageScore < scoreThreshold || s.attendance < attendanceThreshold
    )
}

/**
 * Calculate content engagement metrics
 */
export function calculateContentEngagement(
    contentId: string,
    viewCount: number,
    downloadCount: number,
    totalStudents: number
): ContentEngagement {
    return {
        contentId,
        viewCount,
        downloadCount,
        completionRate: totalStudents > 0 ? (viewCount / totalStudents) * 100 : 0
    }
}

/**
 * Format number with comma separators
 */
export function formatNumber(num: number): string {
    return num.toLocaleString()
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
    return `${Math.round(value)}%`
}
