'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAssignmentStore } from '@/store/assignment-store'
import { assignmentSchema, type AssignmentFormData } from '@/lib/validations/assignment'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentEditor } from '@/components/content/content-editor'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

export default function EditAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const { getAssignmentById, updateAssignment } = useAssignmentStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const assignment = getAssignmentById(id)

    if (!assignment) {
        notFound()
    }

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AssignmentFormData>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            title: assignment.title,
            description: assignment.description,
            instructions: assignment.instructions,
            type: assignment.type,
            status: assignment.status,
            gradingType: assignment.gradingType,
            maxPoints: assignment.maxPoints,
            passingScore: assignment.passingScore,
            allowLateSubmission: assignment.allowLateSubmission,
            batchIds: assignment.batchIds,
            assignedDate: assignment.assignedDate,
            dueDate: assignment.dueDate,
        },
    })

    const assignmentType = watch('type')
    const gradingType = watch('gradingType')

    const onSubmit: SubmitHandler<AssignmentFormData> = async (data) => {
        setIsSubmitting(true)

        await new Promise(resolve => setTimeout(resolve, 1000))

        updateAssignment(id, data)
        router.push(`/teacher/assignments/${id}`)
    }

    return (
        <DashboardLayout
            role="teacher"
            title={`Edit: ${assignment.title}`}
            subtitle="Update assignment details"
        >
            <div className="mb-4">
                <Link href={`/teacher/assignments/${id}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Assignment
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Update the essential details for your assignment
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        {...register('title')}
                                        placeholder="e.g., Chapter 5 Practice Problems"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        {...register('description')}
                                        placeholder="Brief description of the assignment..."
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Assignment Type *</Label>
                                        <Select
                                            value={assignmentType}
                                            onValueChange={(value: any) => setValue('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text Submission</SelectItem>
                                                <SelectItem value="file">File Upload</SelectItem>
                                                <SelectItem value="link">Link/URL</SelectItem>
                                                <SelectItem value="quiz">Quiz</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={watch('status')}
                                            onValueChange={(value: any) => setValue('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="closed">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Instructions Tab */}
                    <TabsContent value="instructions" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment Instructions</CardTitle>
                                <CardDescription>
                                    Update detailed instructions for students
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ContentEditor
                                    value={watch('instructions') || ''}
                                    onChange={(value) => setValue('instructions', value)}
                                />
                                {errors.instructions && (
                                    <p className="text-sm text-destructive">{errors.instructions.message}</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Grading & Due Date</CardTitle>
                                <CardDescription>
                                    Configure grading and deadline settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Grading Type</Label>
                                        <Select
                                            value={gradingType}
                                            onValueChange={(value: any) => setValue('gradingType', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="points">Points Based</SelectItem>
                                                <SelectItem value="passfail">Pass/Fail</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="maxPoints">Max Points *</Label>
                                        <Input
                                            id="maxPoints"
                                            type="number"
                                            {...register('maxPoints', { valueAsNumber: true })}
                                            placeholder="100"
                                        />
                                        {errors.maxPoints && (
                                            <p className="text-sm text-destructive">{errors.maxPoints.message}</p>
                                        )}
                                    </div>
                                </div>

                                {gradingType === 'passfail' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="passingScore">Passing Score (Optional)</Label>
                                        <Input
                                            id="passingScore"
                                            type="number"
                                            {...register('passingScore', { valueAsNumber: true })}
                                            placeholder="60"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Minimum score required to pass
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="dueDate">Due Date *</Label>
                                        <Input
                                            id="dueDate"
                                            type="datetime-local"
                                            defaultValue={format(assignment.dueDate, "yyyy-MM-dd'T'HH:mm")}
                                            {...register('dueDate', {
                                                setValueAs: (value) => value ? new Date(value) : new Date()
                                            })}
                                        />
                                        {errors.dueDate && (
                                            <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="assignedDate">Assigned Date</Label>
                                        <Input
                                            id="assignedDate"
                                            type="datetime-local"
                                            defaultValue={format(assignment.assignedDate, "yyyy-MM-dd'T'HH:mm")}
                                            {...register('assignedDate', {
                                                setValueAs: (value) => value ? new Date(value) : new Date()
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="allowLateSubmission"
                                        defaultChecked={assignment.allowLateSubmission}
                                        {...register('allowLateSubmission')}
                                    />
                                    <Label htmlFor="allowLateSubmission" className="cursor-pointer">
                                        Allow late submissions
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Batch Assignment</CardTitle>
                                <CardDescription>
                                    Select which batches can see this assignment
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>Batches *</Label>
                                    <div className="space-y-2">
                                        {['batch-1', 'batch-2', 'batch-3'].map((batchId, idx) => (
                                            <label key={batchId} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    value={batchId}
                                                    defaultChecked={assignment.batchIds.includes(batchId)}
                                                    onChange={(e) => {
                                                        const current = watch('batchIds') || []
                                                        setValue(
                                                            'batchIds',
                                                            e.target.checked
                                                                ? [...current, batchId]
                                                                : current.filter(id => id !== batchId)
                                                        )
                                                    }}
                                                />
                                                <span>
                                                    {idx === 0 && 'Mathematics Batch'}
                                                    {idx === 1 && 'Science Batch'}
                                                    {idx === 2 && 'Programming Batch'}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.batchIds && (
                                        <p className="text-sm text-destructive">{errors.batchIds.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </DashboardLayout>
    )
}
