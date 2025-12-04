'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAssignmentStore } from '@/store/assignment-store'
import { gradingSchema, type GradingFormData } from '@/lib/validations/assignment'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubmissionStatusBadge } from '@/components/assignments/submission-status-badge'
import { GradeDisplay } from '@/components/assignments/grade-display'
import { ArrowLeft, FileText, ExternalLink as LinkIcon, Save, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default function GradeSubmissionPage({
    params
}: {
    params: Promise<{ id: string; submissionId: string }>
}) {
    const router = useRouter()
    const { id, submissionId } = use(params)
    const { getAssignmentById, getSubmissionsByAssignment, gradeSubmission } = useAssignmentStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const assignment = getAssignmentById(id)
    const submissions = getSubmissionsByAssignment(id)
    const submission = submissions.find(s => s.id === submissionId)

    if (!assignment || !submission) {
        notFound()
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<GradingFormData>({
        resolver: zodResolver(gradingSchema),
        defaultValues: {
            submissionId: submission.id,
            grade: submission.grade || 0,
            feedback: submission.feedback || '',
        },
    })

    const onSubmit: SubmitHandler<GradingFormData> = async (data) => {
        setIsSubmitting(true)

        await new Promise(resolve => setTimeout(resolve, 1000))

        gradeSubmission(submission.id, data.grade, data.feedback)
        router.push(`/teacher/assignments/${id}/submissions`)
    }

    const isAlreadyGraded = submission.status === 'graded'

    return (
        <DashboardLayout
            role="teacher"
            title={`Grade Submission - ${submission.studentName}`}
            subtitle={assignment.title}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href={`/teacher/assignments/${id}/submissions`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Submissions
                    </Button>
                </Link>

                <SubmissionStatusBadge
                    status={submission.status}
                    isLate={submission.isLate}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - Submission */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Submission Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Submission</CardTitle>
                            <CardDescription>
                                Submitted {format(submission.submittedAt, 'PPp')}
                                {submission.isLate && <span className="text-destructive ml-2">(Late)</span>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Text Submission */}
                            {submission.type === 'text' && submission.textContent && (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: submission.textContent }} />
                                </div>
                            )}

                            {/* File Submission */}
                            {submission.type === 'file' && submission.fileName && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-8 h-8 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{submission.fileName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {(submission.fileSize! / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" disabled>
                                            <FileText className="w-4 h-4 mr-2" />
                                            Preview
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        File preview is not available in demo mode. In production, you would be able to download and view the file.
                                    </p>
                                </div>
                            )}

                            {/* Link Submission */}
                            {submission.type === 'link' && submission.linkUrl && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                                        <LinkIcon className="w-6 h-6 text-muted-foreground" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium mb-1">Submitted Link:</p>
                                            <a
                                                href={submission.linkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline break-all"
                                            >
                                                {submission.linkUrl}
                                            </a>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <a
                                                href={submission.linkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <LinkIcon className="w-4 h-4 mr-2" />
                                                Open
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Previous Feedback (if graded) */}
                    {isAlreadyGraded && submission.feedback && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Previous Feedback</CardTitle>
                                <CardDescription>
                                    Graded {submission.gradedAt && format(submission.gradedAt, 'PPp')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-wrap">{submission.feedback}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Grading Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {isAlreadyGraded ? 'Update Grade' : 'Grade Submission'}
                            </CardTitle>
                            <CardDescription>
                                Provide a grade and feedback for the student
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="grade">
                                        Grade * (out of {assignment.maxPoints})
                                    </Label>
                                    <Input
                                        id="grade"
                                        type="number"
                                        min="0"
                                        max={assignment.maxPoints}
                                        {...register('grade', { valueAsNumber: true })}
                                        placeholder={`Enter grade (0-${assignment.maxPoints})`}
                                    />
                                    {errors.grade && (
                                        <p className="text-sm text-destructive">{errors.grade.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="feedback">Feedback (Optional)</Label>
                                    <textarea
                                        id="feedback"
                                        {...register('feedback')}
                                        placeholder="Provide feedback for the student..."
                                        rows={6}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.feedback && (
                                        <p className="text-sm text-destructive">{errors.feedback.message}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                                        {isSubmitting ? (
                                            <>
                                                <Save className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                {isAlreadyGraded ? 'Update Grade' : 'Submit Grade'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Student & Assignment Info */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                                <p className="font-semibold">{submission.studentName}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Submitted</p>
                                <p className="text-sm">{format(submission.submittedAt, 'PPP')}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(submission.submittedAt, 'p')}
                                </p>
                            </div>

                            {submission.isLate && (
                                <div>
                                    <p className="text-sm font-medium text-destructive mb-1">Late Submission</p>
                                    <p className="text-xs text-muted-foreground">
                                        Submitted after due date
                                    </p>
                                </div>
                            )}

                            {isAlreadyGraded && (
                                <div className="pt-3 border-t">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Current Grade</p>
                                    <GradeDisplay
                                        grade={submission.grade!}
                                        maxPoints={submission.maxPoints}
                                        passingScore={assignment.passingScore}
                                        size="md"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Graded {submission.gradedAt && format(submission.gradedAt, 'PPp')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground mb-1">Type</p>
                                <p className="font-medium capitalize">{assignment.type}</p>
                            </div>

                            <div>
                                <p className="text-muted-foreground mb-1">Grading</p>
                                <p className="font-medium">
                                    {assignment.gradingType === 'points' ? 'Points Based' : 'Pass/Fail'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Max: {assignment.maxPoints} points
                                </p>
                                {assignment.passingScore && (
                                    <p className="text-xs text-muted-foreground">
                                        Passing: {assignment.passingScore}+
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-muted-foreground mb-1">Due Date</p>
                                <p className="font-medium">{format(assignment.dueDate, 'PPP')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
