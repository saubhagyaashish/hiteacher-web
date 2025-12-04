'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useAssignmentStore } from '@/store/assignment-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssignmentStatusBadge } from '@/components/assignments/assignment-status-badge'
import { DueDateCountdown } from '@/components/assignments/due-date-countdown'
import { ArrowLeft, Edit2, Trash2, Copy, Users, FileText, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default function AssignmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { getAssignmentById, getSubmissionsByAssignment, deleteAssignment, duplicateAssignment } = useAssignmentStore()

    const { id } = use(params)
    const assignment = getAssignmentById(id)
    const submissions = getSubmissionsByAssignment(id)

    if (!assignment) {
        notFound()
    }

    const handleDelete = () => {
        if (confirm(`Delete "${assignment.title}"?`)) {
            deleteAssignment(assignment.id)
            router.push('/teacher/assignments')
        }
    }

    const handleDuplicate = () => {
        duplicateAssignment(assignment.id)
        router.push('/teacher/assignments')
    }

    const submittedCount = submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length
    const gradedCount = submissions.filter(s => s.status === 'graded').length
    const pendingCount = submissions.filter(s => s.status === 'submitted').length
    const lateCount = submissions.filter(s => s.isLate).length

    const avgGrade = gradedCount > 0
        ? submissions
            .filter(s => s.grade !== undefined)
            .reduce((sum, s) => sum + s.grade!, 0) / gradedCount
        : undefined

    return (
        <DashboardLayout
            role="teacher"
            title={assignment.title}
            subtitle={assignment.description}
        >
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/teacher/assignments">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Assignments
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    <AssignmentStatusBadge status={assignment.status} />
                    <Button variant="outline" size="sm" onClick={handleDuplicate}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                    </Button>
                    <Link href={`/teacher/assignments/${assignment.id}/edit`}>
                        <Button size="sm">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="submissions">
                                Submissions
                                {pendingCount > 0 && (
                                    <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                                        {pendingCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Instructions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: assignment.instructions }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Statistics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Submission Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Submitted</span>
                                            </div>
                                            <p className="text-2xl font-bold">
                                                {submittedCount}/{submissions.length}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {((submittedCount / submissions.length) * 100).toFixed(0)}% completion
                                            </p>
                                        </div>

                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Pending Review</span>
                                            </div>
                                            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                                            <Link href={`/teacher/assignments/${id}/submissions`}>
                                                <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                                                    Review submissions →
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Graded</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
                                            {avgGrade && (
                                                <p className="text-xs text-muted-foreground">
                                                    Average: {avgGrade.toFixed(1)}%
                                                </p>
                                            )}
                                        </div>

                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Late Submissions</span>
                                            </div>
                                            <p className="text-2xl font-bold text-destructive">{lateCount}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Submissions Tab */}
                        <TabsContent value="submissions">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Student Submissions</CardTitle>
                                        <Link href={`/teacher/assignments/${id}/submissions`}>
                                            <Button size="sm">View All Submissions</Button>
                                        </Link>
                                    </div>
                                    <CardDescription>
                                        Recent submissions from students
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {submissions.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-8">
                                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No submissions yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {submissions.slice(0, 5).map(submission => (
                                                <div
                                                    key={submission.id}
                                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">{submission.studentName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Submitted {format(submission.submittedAt, 'PPp')}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {submission.grade !== undefined ? (
                                                            <Badge variant="secondary">
                                                                {submission.grade}/{submission.maxPoints}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-orange-500/10 text-orange-600">
                                                                Pending
                                                            </Badge>
                                                        )}
                                                        {submission.isLate && (
                                                            <Badge variant="destructive">Late</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar - Metadata */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Type</p>
                                <Badge variant="outline">{assignment.type}</Badge>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                                <AssignmentStatusBadge status={assignment.status} />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Due Date</p>
                                <DueDateCountdown dueDate={assignment.dueDate} showIcon={false} />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {format(assignment.dueDate, 'PPP')}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Grading</p>
                                <p className="text-sm font-medium">
                                    {assignment.gradingType === 'points' ? 'Points Based' : 'Pass/Fail'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Max: {assignment.maxPoints} points
                                </p>
                                {assignment.passingScore && (
                                    <p className="text-sm text-muted-foreground">
                                        Passing: {assignment.passingScore}+
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Late Submissions</p>
                                <p className="text-sm">
                                    {assignment.allowLateSubmission ? 'Allowed' : 'Not Allowed'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
                                <p className="text-sm">{format(assignment.createdAt, 'PPP')}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                                <p className="text-sm">{format(assignment.updatedAt, 'PPP')}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Assigned Batches ({assignment.batchIds.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                {assignment.batchIds.map(batchId => (
                                    <div key={batchId} className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>Batch {batchId.split('-')[1]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
