'use client'

import { useMemo } from 'react'
import { useAssignmentStore } from '@/store/assignment-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Grid3x3, List, ClipboardList, FileCheck, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { AssignmentCard } from '@/components/assignments/assignment-card'
import { ViewMode } from '@/types/assignment'
import { useState } from 'react'

export default function AssignmentsPage() {
    const {
        filters,
        setFilters,
        getFilteredAssignments,
        getStats,
        deleteAssignment,
        duplicateAssignment,
    } = useAssignmentStore()

    const [viewMode, setViewMode] = useState<ViewMode>('grid')

    const filteredAssignments = useMemo(() => getFilteredAssignments(), [filters, getFilteredAssignments])
    const stats = useMemo(() => getStats(), [getStats])

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this assignment?')) {
            deleteAssignment(id)
        }
    }

    const handleDuplicate = (id: string) => {
        duplicateAssignment(id)
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Assignments"
            subtitle="Manage assignments and track student submissions"
        >
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active} active • {stats.draft} drafts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pendingReview}</div>
                        <p className="text-xs text-muted-foreground">Awaiting grading</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Graded</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.graded}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalSubmissions} total submissions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.averageGrade ? `${stats.averageGrade.toFixed(1)}%` : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.passingRate ? `${stats.passingRate.toFixed(1)}% passing` : 'No data'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search assignments..."
                        value={filters.search || ''}
                        onChange={(e) => setFilters({ search: e.target.value })}
                        className="pl-9"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => setFilters({ status: value as any })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Drafts</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.type || 'all'}
                        onValueChange={(value) => setFilters({ type: value as any })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="file">File Upload</SelectItem>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.dueDate || 'all'}
                        onValueChange={(value) => setFilters({ dueDate: value as any })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Due Date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-1 border rounded-md p-1">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                {/* Create Button */}
                <Link href="/teacher/assignments/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assignment
                    </Button>
                </Link>
            </div>

            {/* Assignments List/Grid */}
            {filteredAssignments.length === 0 ? (
                <Card className="p-12 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
                    <p className="text-muted-foreground mb-4">
                        {filters.search || filters.status !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Get started by creating your first assignment'}
                    </p>
                    <Link href="/teacher/assignments/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Assignment
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div
                    className={
                        viewMode === 'grid'
                            ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
                            : 'space-y-4'
                    }
                >
                    {filteredAssignments.map((assignment) => (
                        <AssignmentCard
                            key={assignment.id}
                            assignment={assignment}
                            viewMode={viewMode}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}
