'use client'

import { useState } from 'react'
import { useClassStore } from '@/store/class-store'
import { useBatchStore } from '@/store/batch-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/classes/calendar'
import { ClassCard } from '@/components/classes/class-card'
import { StatCard } from '@/components/dashboard/stat-card'
import {
    Plus,
    Search,
    Calendar as CalendarIcon,
    List,
    Users,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TeacherClassesPage() {
    const router = useRouter()
    const { getFilteredClasses, getTodayClasses, getStats, filters, setFilters, cancelClass } = useClassStore()
    const { batches } = useBatchStore()
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

    const allClasses = getFilteredClasses()
    const todayClasses = getTodayClasses()
    const stats = getStats()

    const handleCancelClass = (classId: string) => {
        if (confirm('Are you sure you want to cancel this class?')) {
            cancelClass(classId)
        }
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Classes"
            subtitle="Manage your class schedule and attendance"
        >
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <StatCard
                    title="Total Classes"
                    value={stats.total.toString()}
                    description={`${stats.scheduled} scheduled, ${stats.completed} completed`}
                    icon={CalendarIcon}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Today's Classes"
                    value={stats.todayClasses.toString()}
                    description={todayClasses.length === 0 ? 'No classes today' : `${todayClasses.length} scheduled`}
                    icon={Clock}
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Avg. Attendance"
                    value={`${stats.avgAttendance}%`}
                    description="Based on completed classes"
                    icon={Users}
                    iconColor="text-green-600"
                />
                <StatCard
                    title="This Week"
                    value={stats.upcomingThisWeek.toString()}
                    description="Upcoming classes"
                    icon={CheckCircle2}
                    iconColor="text-purple-600"
                />
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search classes by title, topic, or batch..."
                        value={filters.search}
                        onChange={(e) => setFilters({ search: e.target.value })}
                        className="pl-10"
                    />
                </div>

                {/* Batch Filter */}
                <select
                    value={filters.batchId}
                    onChange={(e) => setFilters({ batchId: e.target.value })}
                    className="px-3 py-2 border rounded-md bg-background"
                >
                    <option value="all">All Batches</option>
                    {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                            {batch.name}
                        </option>
                    ))}
                </select>

                {/* Status Filter */}
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ status: e.target.value as any })}
                    className="px-3 py-2 border rounded-md bg-background"
                >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {/* Date Range Filter */}
                <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({ dateRange: e.target.value as any })}
                    className="px-3 py-2 border rounded-md bg-background"
                >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>

                {/* View Toggle */}
                <div className="flex gap-1 border rounded-md p-1">
                    <Button
                        size="sm"
                        variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('calendar')}
                    >
                        <CalendarIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('list')}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>

                {/* Create Button */}
                <Link href="/teacher/classes/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Class
                    </Button>
                </Link>
            </div>

            {/* Today's Classes Quick View */}
            {todayClasses.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Today's Classes
                    </h2>
                    <div className="space-y-3">
                        {todayClasses.map((cls) => (
                            <ClassCard
                                key={cls.id}
                                classSession={cls}
                                variant="compact"
                                role="teacher"
                                onEdit={(id) => router.push(`/teacher/classes/${id}/edit`)}
                                onCancel={handleCancelClass}
                                onJoin={(url) => window.open(url, '_blank')}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content - Calendar or List View */}
            {viewMode === 'calendar' ? (
                <Calendar
                    classes={allClasses}
                    onDateClick={(date) => {
                        // Optionally navigate to create class with pre-selected date
                        router.push('/teacher/classes/new')
                    }}
                    onClassClick={(cls) => router.push(`/teacher/classes/${cls.id}`)}
                />
            ) : (
                <div className="space-y-3">
                    {allClasses.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-semibold text-lg mb-2">No Classes Found</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {filters.search || filters.batchId !== 'all' || filters.status !== 'all'
                                        ? 'Try adjusting your filters'
                                        : 'Get started by creating your first class'}
                                </p>
                                <Link href="/teacher/classes/new">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Class
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        allClasses.map((cls) => (
                            <ClassCard
                                key={cls.id}
                                classSession={cls}
                                role="teacher"
                                onEdit={(id) => router.push(`/teacher/classes/${id}/edit`)}
                                onCancel={handleCancelClass}
                                onJoin={(url) => window.open(url, '_blank')}
                            />
                        ))
                    )}
                </div>
            )}
        </DashboardLayout>
    )
}
