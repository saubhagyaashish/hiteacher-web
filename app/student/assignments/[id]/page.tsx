'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAssignmentStore } from '@/store/assignment-store'
import { submissionSchema, type SubmissionFormData } from '@/lib/validations/assignment'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentEditor } from '@/components/content/content-editor'
import { DueDateCountdown } from '@/components/assignments/due-date-countdown'
import { GradeDisplay } from '@/components/assignments/grade-display'
import { SubmissionStatusBadge } from '@/components/assignments/submission-status-badge'
import { Send, FileText, Upload, LinkIcon as Link2, ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { format, isPast } from 'date-fns'
import { notFound } from 'next/navigation'
import { useContentStore } from '@/store/content-store'
import { LinkedContentCard } from '@/components/assignments/linked-content-card'

// Mock student info
const CURRENT_STUDENT = {
    id: 'student-1',
    name: 'John Doe'
}

export default function StudentAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const { getAssignmentById, getSubmissionsByStudent, addSubmission } = useAssignmentStore()
    const { getContentById } = useContentStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const assignment = getAssignmentById(id)
    const mySubmissions = getSubmissionsByStudent(CURRENT_STUDENT.id)
    const mySubmission = mySubmissions.find(s => s.assignmentId === id)

    if (!assignment) {
        notFound()
    }

    const isOverdue = isPast(assignment.dueDate)
    const canSubmit = assignment.status === 'active' && (!isOverdue || assignment.allowLateSubmission)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SubmissionFormData>({
        resolver: zodResolver(submissionSchema),
        defaultValues: {
            assignmentId: assignment.id,
            type: assignment.type,
            textContent: '',
            linkUrl: '',
        },
    })

    const onSubmit: SubmitHandler<SubmissionFormData> = async (data) => {
        setIsSubmitting(true)

        await new Promise(resolve => setTimeout(resolve, 1500))

        const newSubmission = {
            id: `submission-${Date.now()}`,
            assignmentId: assignment.id,
            studentId: CURRENT_STUDENT.id,
            studentName: CURRENT_STUDENT.name,
            type: assignment.type,
            textContent: data.textContent,
            fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
            fileName: selectedFile?.name,
            fileSize: selectedFile?.size,
            linkUrl: data.linkUrl,
            status: 'submitted' as const,
            submittedAt: new Date(),
            isLate: isOverdue,
            maxPoints: assignment.maxPoints,
            version: 1,
        }

        addSubmission(newSubmission)
        router.push('/student/assignments')
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setValue('fileUrl', URL.createObjectURL(file))
            setValue('fileName', file.name)
            setValue('fileSize', file.size)
        }
    }

    return (
        <DashboardLayout
            role="student"
            title={assignment.title}
            subtitle={assignment.description}
        >
            <div className="mb-4">
                <Link href="/student/assignments">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Assignments
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Instructions */}
                    <Tabs defaultValue="instructions">
                        <TabsList>
                            <TabsTrigger value="instructions">Instructions</TabsTrigger>
                            {mySubmission && <TabsTrigger value="my-submission">My Submission</TabsTrigger>}
                        </TabsList>

                        <TabsContent value="instructions">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assignment Instructions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: assignment.instructions }}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {mySubmission && (
                            <TabsContent value="my-submission">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Submission</CardTitle>
                                        <CardDescription>
                                            Submitted {format(mySubmission.submittedAt, 'PPp')}
                                            {mySubmission.isLate && <span className="text-destructive ml-2">(Late)</span>}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Show submitted content */}
                                        {mySubmission.type === 'text' && mySubmission.textContent && (
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <div dangerouslySetInnerHTML={{ __html: mySubmission.textContent }} />
                                            </div>
                                        )}

                                        {mySubmission.type === 'file' && mySubmission.fileName && (
                                            <div className="flex items-center gap-3 p-4 border rounded-lg">
                                                <FileText className="w-8 h-8 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">{mySubmission.fileName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {(mySubmission.fileSize! / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {mySubmission.type === 'link' && mySubmission.linkUrl && (
                                            <div className="p-4 border rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-2">Submitted Link:</p>
                                                <a
                                                    href={mySubmission.linkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline break-all"
                                                >
                                                    {mySubmission.linkUrl}
                                                </a>
                                            </div>
                                        )}

                                        {/* Show grade and feedback if available */}
                                        {mySubmission.status === 'graded' && (
                                            <>
                                                <div className="p-4 bg-muted rounded-lg">
                                                    <p className="text-sm text-muted-foreground mb-3">Your Grade</p>
                                                    <GradeDisplay
                                                        grade={mySubmission.grade!}
                                                        maxPoints={mySubmission.maxPoints}
                                                        passingScore={assignment.passingScore}
                                                    />
                                                </div>

                                                {mySubmission.feedback && (
                                                    <div className="p-4 bg-muted rounded-lg">
                                                        <p className="text-sm font-medium mb-2">Teacher Feedback</p>
                                                        <p className="text-sm whitespace-pre-wrap">
                                                            {mySubmission.feedback}
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>

                    {/* Linked Content */}
                    {assignment.linkedContentIds && assignment.linkedContentIds.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Related Learning Materials</CardTitle>
                                <CardDescription>
                                    Review these materials before completing the assignment
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {assignment.linkedContentIds.map(contentId => {
                                    const content = getContentById(contentId)
                                    if (!content) return null
                                    return (
                                        <LinkedContentCard
                                            key={contentId}
                                            content={content}
                                        />
                                    )
                                })}
                            </CardContent>
                        </Card>
                    )}

                    {/* Submission Form */}
                    {!mySubmission && canSubmit && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Submit Your Work</CardTitle>
                                <CardDescription>
                                    {isOverdue && assignment.allowLateSubmission
                                        ? 'This assignment is overdue, but late submissions are allowed'
                                        : 'Complete and submit your assignment below'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Text Submission */}
                                    {assignment.type === 'text' && (
                                        <div className="space-y-2">
                                            <Label>Your Answer *</Label>
                                            <ContentEditor
                                                value={watch('textContent') || ''}
                                                onChange={(value) => setValue('textContent', value)}
                                            />
                                            {errors.textContent && (
                                                <p className="text-sm text-destructive">{errors.textContent.message}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* File Upload */}
                                    {assignment.type === 'file' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="file">Upload File *</Label>
                                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                                {selectedFile ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <FileText className="w-8 h-8 text-primary" />
                                                            <div className="text-left">
                                                                <p className="font-medium">{selectedFile.name}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedFile(null)}
                                                        >
                                                            Choose Different File
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                                                        <div>
                                                            <Label htmlFor="file" className="cursor-pointer">
                                                                <Button type="button" variant="outline" asChild>
                                                                    <span>Choose File</span>
                                                                </Button>
                                                            </Label>
                                                            <Input
                                                                id="file"
                                                                type="file"
                                                                className="hidden"
                                                                onChange={handleFileChange}
                                                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                                            />
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Supported: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.fileUrl && (
                                                <p className="text-sm text-destructive">{errors.fileUrl.message}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Link Submission */}
                                    {assignment.type === 'link' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="linkUrl">Submission Link *</Label>
                                            <Input
                                                id="linkUrl"
                                                {...register('linkUrl')}
                                                placeholder="https://example.com/your-work"
                                                type="url"
                                            />
                                            {errors.linkUrl && (
                                                <p className="text-sm text-destructive">{errors.linkUrl.message}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                Enter the URL to your work (e.g., Google Docs, GitHub repository, etc.)
                                            </p>
                                        </div>
                                    )}

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
                                                    <Send className="w-4 h-4 mr-2 animate-pulse" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Submit Assignment
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {!canSubmit && !mySubmission && (
                        <Card className="border-destructive">
                            <CardContent className="p-6 text-center">
                                <p className="text-destructive font-medium mb-2">This assignment is closed</p>
                                <p className="text-sm text-muted-foreground">
                                    {isOverdue
                                        ? 'The due date has passed and late submissions are not allowed.'
                                        : 'This assignment is no longer accepting submissions.'}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {mySubmission && mySubmission.status === 'submitted' && (
                        <Card className="border-orange-500">
                            <CardContent className="p-6 text-center">
                                <CheckCircle2 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                                <h3 className="font-semibold text-lg mb-2">Submission Received!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your work has been submitted and is waiting to be graded by your teacher.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Due Date</p>
                                <DueDateCountdown dueDate={assignment.dueDate} showIcon={false} />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {format(assignment.dueDate, 'PPP p')}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Type</p>
                                <p className="capitalize">{assignment.type} Submission</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Points</p>
                                <p className="font-semibold">{assignment.maxPoints} points</p>
                                {assignment.passingScore && (
                                    <p className="text-xs text-muted-foreground">
                                        Passing: {assignment.passingScore}+
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Late Submissions</p>
                                <p className="text-sm">
                                    {assignment.allowLateSubmission ? 'Allowed' : 'Not Allowed'}
                                </p>
                            </div>

                            {mySubmission && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                                    <SubmissionStatusBadge
                                        status={mySubmission.status}
                                        isLate={mySubmission.isLate}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
