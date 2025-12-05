'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useBatchStore } from '@/store/batch-store'
import { useAssignmentStore } from '@/store/assignment-store'
import { useClassStore } from '@/store/class-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { PerformanceChart } from '@/components/analytics/performance-chart'
import { GradeDistributionChart } from '@/components/analytics/grade-distribution-chart'
import { AttendancePieChart } from '@/components/analytics/attendance-pie-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Download,
    TrendingUp,
    Users,
    BookOpen,
    Calendar,
    BarChart3,
    FileText
} from 'lucide-react'
import {
    calculateBatchAnalytics,
    calculateGradeDistribution,
    calculateAttendanceDistribution,
    generatePerformanceTrend,
    generateAttendanceTrend,
    getTopPerformers,
    getStudentsNeedingAttention,
    calculateStudentPerformance
} from '@/lib/utils/analytics-utils'
import { exportBatchToExcel, exportToPDF } from '@/lib/utils/export-utils'

export default function TeacherAnalyticsPage() {
    const { user } = useAuthStore()
    const { batches } = useBatchStore()
    const { submissions } = useAssignmentStore()
    const { classes } = useClassStore()
    const [selectedBatch, setSelectedBatch] = useState<string>('all')
    const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30')

    if (!user) return null

    // Filter data by selected batch
    const filteredBatches = selectedBatch === 'all'
        ? batches
        : batches.filter(b => b.id === selectedBatch)

    // Calculate overall metrics
    const totalStudents = filteredBatches.reduce((sum, b) => sum + b.studentIds.length, 0)

    const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.grade !== undefined)
    const averageGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.grade! / s.maxPoints) * 100, 0) / gradedSubmissions.length
        : 0

    const filteredClasses = selectedBatch === 'all'
        ? classes
        : classes.filter(c => filteredBatches.some(b => b.id === c.batchId))

    const completedClasses = filteredClasses.filter(c => c.status === 'completed')
    const totalAttendanceSlots = completedClasses.reduce((sum, c) => sum + c.attendance.length, 0)
    const totalPresent = completedClasses.reduce((sum, c) => {
        return sum + c.attendance.filter(a => a.status === 'present' || a.status === 'late').length
    }, 0)
    const averageAttendance = totalAttendanceSlots > 0 ? (totalPresent / totalAttendanceSlots) * 100 : 0

    // Generate chart data
    const gradeDistribution = calculateGradeDistribution(submissions)
    const attendanceDistribution = calculateAttendanceDistribution(filteredClasses)
    const performanceTrend = generatePerformanceTrend(submissions, parseInt(dateRange))
    const attendanceTrend = generateAttendanceTrend(filteredClasses, parseInt(dateRange))

    // Calculate student performance for ranking
    const allStudentIds = new Set<string>()
    filteredBatches.forEach(b => b.studentIds.forEach(id => allStudentIds.add(id)))

    const studentPerformanceList = Array.from(allStudentIds).map(studentId =>
        calculateStudentPerformance(studentId, submissions, filteredClasses)
    ).filter(p => p !== null)

    const topPerformers = getTopPerformers(studentPerformanceList, 5)
    const studentsNeedingAttention = getStudentsNeedingAttention(studentPerformanceList)

    // Export handlers
    const handleExportPDF = () => {
        exportToPDF(
            'Teacher Analytics Report',
            [
                { metric: 'Total Students', value: totalStudents },
                { metric: 'Average Grade', value: `${averageGrade.toFixed(1)}%` },
                { metric: 'Average Attendance', value: `${averageAttendance.toFixed(1)}%` },
                { metric: 'Total Batches', value: filteredBatches.length }
            ],
            [
                { header: 'Metric', dataKey: 'metric' },
                { header: 'Value', dataKey: 'value' }
            ],
            'analytics_report.pdf'
        )
    }

    const handleExportExcel = () => {
        exportBatchToExcel(
            selectedBatch === 'all' ? 'All Batches' : filteredBatches[0]?.name || 'Batch',
            {
                totalStudents,
                activeStudents: totalStudents,
                averageScore: averageGrade,
                averageAttendance
            },
            studentPerformanceList.map(s => ({
                studentId: s.studentId,
                averageScore: s.averageScore,
                attendance: s.attendance,
                assignmentsCompleted: s.assignmentsCompleted,
                totalAssignments: s.totalAssignments
            })),
            [],
            'analytics_export.xlsx'
        )
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Analytics & Reports"
            subtitle="Track performance, attendance, and engagement"
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                >
                    <option value="all">All Batches</option>
                    {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                            {batch.name}
                        </option>
                    ))}
                </select>

                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="px-3 py-2 border rounded-md bg-background"
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                </select>

                <div className="flex gap-2 ml-auto">
                    <Button onClick={handleExportPDF} variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                    <Button onClick={handleExportExcel} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <StatCard
                    title="Total Students"
                    value={totalStudents.toString()}
                    description={`Across ${filteredBatches.length} batch${filteredBatches.length !== 1 ? 'es' : ''}`}
                    icon={Users}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Avg. Grade"
                    value={`${averageGrade.toFixed(1)}%`}
                    description="Based on graded assignments"
                    icon={TrendingUp}
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Avg. Attendance"
                    value={`${averageAttendance.toFixed(1)}%`}
                    description="Across completed classes"
                    icon={Calendar}
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Total Classes"
                    value={filteredClasses.length.toString()}
                    description={`${completedClasses.length} completed`}
                    icon={BookOpen}
                    iconColor="text-purple-600"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
                <PerformanceChart
                    data={performanceTrend}
                    title="Performance Trend"
                    description={`Average scores over the last ${dateRange} days`}
                    color="#3b82f6"
                />

                <PerformanceChart
                    data={attendanceTrend}
                    title="Attendance Trend"
                    description={`Attendance rate over the last ${dateRange} days`}
                    color="#10b981"
                    yAxisLabel="Attendance (%)"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-6">
                <GradeDistributionChart data={gradeDistribution} />
                <AttendancePieChart data={attendanceDistribution} />
            </div>

            {/* Insights */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Performers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Top Performers
                        </CardTitle>
                        <CardDescription>Students with highest average scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topPerformers.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No performance data yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {topPerformers.map((student, index) => (
                                    <div key={student.studentId} className="flex items-center justify-between p-3 border rounded-md">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{student.studentId}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {student.assignmentsCompleted} assignments completed
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">
                                            {student.averageScore.toFixed(1)}%
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Students Needing Attention */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Needs Attention
                        </CardTitle>
                        <CardDescription>Students with low scores or attendance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {studentsNeedingAttention.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                All students performing well! 🎉
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {studentsNeedingAttention.slice(0, 5).map((student) => (
                                    <div key={student.studentId} className="flex items-center justify-between p-3 border rounded-md border-orange-200 bg-orange-50 dark:bg-orange-950">
                                        <div>
                                            <p className="font-medium">{student.studentId}</p>
                                            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                                                <span>Score: {student.averageScore.toFixed(1)}%</span>
                                                <span>Attendance: {student.attendance.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            Contact
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
