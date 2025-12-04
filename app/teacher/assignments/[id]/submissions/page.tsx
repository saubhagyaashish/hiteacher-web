'use client'

import { use } from 'react'
import { useAssignmentStore } from '@/store/assignment-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { SubmissionStatusBadge } from '@/components/assignments/submission-status-badge'
import { GradeDisplay } from '@/components/assignments/grade-display'
import { ArrowLeft, FileText, ExternalLink as LinkIcon, Download } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import { SubmissionStatus } from '@/types/assignment'

export default function SubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { getAssignmentById, getSubmissionsByAssignment } = useAssignmentStore()
    const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all')

    const assignment = getAssignmentById(id)
    const allSubmissions = getSubmissionsByAssignment(id)

    if (!assignment) {
        notFound()
    }

    const filteredSubmissions = statusFilter === 'all'
        ? allSubmissions
        : allSubmissions.filter(s => s.status === statusFilter)

    const pendingCount = allSubmissions.filter(s => s.status === 'submitted').length
    const gradedCount = allSubmissions.filter(s => s.status === 'graded').length
    const lateCount = allSubmissions.filter(s => s.isLate).length

    return (
        <DashboardLayout
            role="teacher"
            title={assignment.title}
            subtitle="Review student submissions"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href={`/teacher/assignments/${id}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Assignment
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filter:</span>
                    <Select
                        value={statusFilter}
                        onValueChange={(value: any) => setStatusFilter(value)}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Submissions</SelectItem>
                            <SelectItem value="pending">Not Submitted</SelectItem>
                            <SelectItem value="submitted">Pending Review</SelectItem>
                            <SelectItem value="graded">Graded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Graded</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{gradedCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Late Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{lateCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Submissions List */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Submissions ({filteredSubmissions.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredSubmissions.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No submissions found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-semibold text-base">
                                                {submission.studentName}
                                            </h4>
                                            <SubmissionStatusBadge
                                                status={submission.status}
                                                isLate={submission.isLate}
                                            />
                                        </div>

                                        {submission.status !== 'pending' && (
                                            <div className="flex flex-col gap-1 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Submitted:</span>
                                                    <span>{format(submission.submittedAt, 'PPp')}</span>
                                                </div>

                                                {/* Show submission preview */}
                                                {submission.type === 'text' && submission.textContent && (
                                                    <div className="mt-2 p-2 bg-muted rounded text-xs line-clamp-2">
                                                        <div
                                                            className="prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: submission.textContent.substring(0, 150) + '...' }}
                                                        />
                                                    </div>
                                                )}

                                                {submission.type === 'file' && submission.fileName && (
                                                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                                        <FileText className="w-4 h-4" />
                                                        <span>{submission.fileName}</span>
                                                        <span className="text-xs">
                                                            ({(submission.fileSize! / 1024).toFixed(1)} KB)
                                                        </span>
                                                    </div>
                                                )}

                                                {submission.type === 'link' && submission.linkUrl && (
                                                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                                        <LinkIcon className="w-4 h-4" />
                                                        <a
                                                            href={submission.linkUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline text-xs"
                                                        >
                                                            {submission.linkUrl}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                        {submission.grade !== undefined ? (
                                            <div className="text-right">
                                                <GradeDisplay
                                                    grade={submission.grade}
                                                    maxPoints={submission.maxPoints}
                                                    size="sm"
                                                    showPercentage={false}
                                                />
                                            </div>
                                        ) : (
                                            submission.status === 'submitted' && (
                                                <div className="text-sm text-orange-600 font-medium">
                                                    Needs Grading
                                                </div>
                                            )
                                        )}

                                        {submission.status !== 'pending' && (
                                            <Link href={`/teacher/assignments/${id}/submissions/${submission.id}`}>
                                                <Button size="sm">
                                                    {submission.status === 'submitted' ? 'Grade' : 'View'}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
