'use client'

import { useState } from 'react'
import { useClassStore } from '@/store/class-store'
import { useBatchStore } from '@/store/batch-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Calendar } from '@/components/classes/calendar'
import { ClassCard } from '@/components/classes/class-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, List, Users, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { format, isFuture, isPast, startOfDay, endOfDay, isToday } from 'date-fns'
import { useRouter } from 'next/navigation'

// Mock current student
const CURRENT_STUDENT = {
    id: 'student-1',
    name: 'John Doe',
    email: 'john@example.com'
}

export default function StudentSchedulePage() {
    const router = useRouter()
    const { classes, getUpcomingClasses } = useClassStore()
    const { batches } = useBatchStore()
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list')
    const [selectedBatch, setSelectedBatch] = useState<string>('all')

    // Get student's batches (in a real app, this would come from student data)
    const studentBatches = batches.filter(b =>
        b.studentIds.includes(CURRENT_STUDENT.id)
    )

    // Filter classes by student's batches
    const studentClasses = classes.filter(cls =>
        studentBatches.some(b => b.id === cls.batchId)
    )

    // Apply batch filter
    const filteredClasses = selectedBatch === 'all'
        ? studentClasses
        : studentClasses.filter(cls => cls.batchId === selectedBatch)

    // Get upcoming classes
    const upcomingClasses = filteredClasses
        .filter(cls => isFuture(cls.startTime) && cls.status === 'scheduled')
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .slice(0, 7)

    // Calculate attendance stats
    const completedClasses = filteredClasses.filter(cls => cls.status === 'completed')
    const attendanceStats = studentBatches.map(batch => {
        const batchCompletedClasses = completedClasses.filter(cls => cls.batchId === batch.id)
        const attendedClasses = batchCompletedClasses.filter(cls =>
            cls.attendance.some(a => a.studentId === CURRENT_STUDENT.id && (a.status === 'present' || a.status === 'late'))
        ).length
        const percentage = batchCompletedClasses.length > 0
            ? Math.round((attendedClasses / batchCompletedClasses.length) * 100)
            : 0

        return {
            batchName: batch.name,
            percentage,
            attended: attendedClasses,
            total: batchCompletedClasses.length
        }
    })

    return (
        <DashboardLayout
            role="student"
            title="My Schedule"
            subtitle="View your class schedule and attendance"
        >
            {/* Filters and View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                <div className="flex gap-2">
                    {/* Batch Filter */}
                    <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background"
                    >
                        <option value="all">All Subjects</option>
                        {studentBatches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                                {batch.subject}
                            </option>
                        ))}
                    </select>
                </div>

                {/* View Toggle */}
                <div className="flex gap-1 border rounded-md p-1">
                    <Button
                        size="sm"
                        variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('calendar')}
                    >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Calendar
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('list')}
                    >
                        <List className="w-4 h-4 mr-2" />
                        List
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Upcoming Classes */}
                    {upcomingClasses.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Upcoming Classes (Next 7 Days)
                            </h2>
                            <div className="space-y-3">
                                {upcomingClasses.map((cls) => (
                                    <ClassCard
                                        key={cls.id}
                                        classSession={cls}
                                        variant="compact"
                                        role="student"
                                        onJoin={(url) => window.open(url, '_blank')}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Calendar or Full List */}
                    {viewMode === 'calendar' ? (
                        <Calendar
                            classes={filteredClasses}
                            onClassClick={(cls) => {
                                // Could navigate to class details page for students
                                console.log('View class:', cls)
                            }}
                        />
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold mb-3">All Classes</h2>
                            {filteredClasses.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="font-semibold text-lg mb-2">No Classes Found</h3>
                                        <p className="text-sm text-muted-foreground">
                                            You don't have any classes scheduled yet.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {filteredClasses
                                        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
                                        .map((cls) => (
                                            <ClassCard
                                                key={cls.id}
                                                classSession={cls}
                                                role="student"
                                                onJoin={(url) => window.open(url, '_blank')}
                                            />
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Attendance Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Attendance Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {attendanceStats.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No attendance data yet
                                </p>
                            ) : (
                                attendanceStats.map((stat, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium">{stat.batchName}</span>
                                            <span className="text-muted-foreground">
                                                {stat.attended}/{stat.total}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${stat.percentage >= 80 ? 'bg-green-500' :
                                                        stat.percentage >= 60 ? 'bg-amber-500' :
                                                            'bg-red-500'
                                                        }`}
                                                    style={{ width: `${stat.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium min-w-[3rem] text-right">
                                                {stat.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Classes</span>
                                <span className="font-semibold">{studentClasses.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Upcoming</span>
                                <span className="font-semibold text-blue-600">
                                    {studentClasses.filter(c => isFuture(c.startTime) && c.status === 'scheduled').length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Completed</span>
                                <span className="font-semibold text-green-600">
                                    {completedClasses.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Subjects</span>
                                <span className="font-semibold">{studentBatches.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
