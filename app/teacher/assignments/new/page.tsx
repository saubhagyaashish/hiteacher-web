'use client'

import { useState } from 'react'
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
import { ContentSelector } from '@/components/assignments/content-selector'
import { LinkedContentCard } from '@/components/assignments/linked-content-card'
import { Save, Send, ArrowLeft, Plus, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { useContentStore } from '@/store/content-store'

export default function NewAssignmentPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const { addAssignment } = useAssignmentStore()
    const { getContentById } = useContentStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedContentIds, setSelectedContentIds] = useState<string[]>([])
    const [showContentSelector, setShowContentSelector] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AssignmentFormData>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            title: '',
            description: '',
            instructions: '',
            type: 'text',
            status: 'draft',
            gradingType: 'points',
            maxPoints: 100,
            allowLateSubmission: true,
            batchIds: [],
            assignedDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
    })

    const assignmentType = watch('type')
    const gradingType = watch('gradingType')

    const onSubmit: SubmitHandler<AssignmentFormData> = async (data) => {
        setIsSubmitting(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newAssignment = {
            id: `assignment-${Date.now()}`,
            ...data,
            attachments: data.attachments?.map(att => ({
                ...att,
                id: `attachment-${Date.now()}-${Math.random()}`
            })),
            linkedContentIds: selectedContentIds,
            teacherId: user?.id || 'teacher-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            submissionCount: 0,
            gradedCount: 0,
        }

        addAssignment(newAssignment)
        router.push('/teacher/assignments')
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Create Assignment"
            subtitle="Create a new assignment for your students"
        >
            <div className="mb-4">
                <Link href="/teacher/assignments">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Assignments
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                        <TabsTrigger value="content">Linked Content</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Provide the essential details for your assignment
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
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

                                {/* Description */}
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
                                    {/* Assignment Type */}
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
                                                <SelectItem value="quiz">Quiz (Coming Soon)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-destructive">{errors.type.message}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                            defaultValue="draft"
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
                                    Provide detailed instructions for students
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

                    {/* Linked Content Tab */}
                    <TabsContent value="content" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Linked Learning Content</CardTitle>
                                <CardDescription>
                                    Attach learning materials students should review before completing this assignment
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowContentSelector(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Link Content
                                </Button>

                                {selectedContentIds.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No content linked yet</p>
                                        <p className="text-sm">Link relevant learning materials to help students prepare</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedContentIds.map(contentId => {
                                            const content = getContentById(contentId)
                                            if (!content) return null
                                            return (
                                                <LinkedContentCard
                                                    key={contentId}
                                                    content={content}
                                                    compact
                                                    onRemove={() => setSelectedContentIds(ids => ids.filter(id => id !== contentId))}
                                                />
                                            )
                                        })}
                                    </div>
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
                                    {/* Grading Type */}
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

                                    {/* Max Points */}
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
                                    {/* Due Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="dueDate">Due Date *</Label>
                                        <Input
                                            id="dueDate"
                                            type="datetime-local"
                                            {...register('dueDate', {
                                                setValueAs: (value) => value ? new Date(value) : new Date()
                                            })}
                                        />
                                        {errors.dueDate && (
                                            <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                                        )}
                                    </div>

                                    {/* Assigned Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="assignedDate">Assigned Date</Label>
                                        <Input
                                            id="assignedDate"
                                            type="datetime-local"
                                            {...register('assignedDate', {
                                                setValueAs: (value) => value ? new Date(value) : new Date()
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Late Submission */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="allowLateSubmission"
                                        defaultChecked
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
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value="batch-1"
                                                onChange={(e) => {
                                                    const current = watch('batchIds') || []
                                                    setValue(
                                                        'batchIds',
                                                        e.target.checked
                                                            ? [...current, 'batch-1']
                                                            : current.filter(id => id !== 'batch-1')
                                                    )
                                                }}
                                            />
                                            <span>Mathematics Batch</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value="batch-2"
                                                onChange={(e) => {
                                                    const current = watch('batchIds') || []
                                                    setValue(
                                                        'batchIds',
                                                        e.target.checked
                                                            ? [...current, 'batch-2']
                                                            : current.filter(id => id !== 'batch-2')
                                                    )
                                                }}
                                            />
                                            <span>Science Batch</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value="batch-3"
                                                onChange={(e) => {
                                                    const current = watch('batchIds') || []
                                                    setValue(
                                                        'batchIds',
                                                        e.target.checked
                                                            ? [...current, 'batch-3']
                                                            : current.filter(id => id !== 'batch-3')
                                                    )
                                                }}
                                            />
                                            <span>Programming Batch</span>
                                        </label>
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
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() => setValue('status', 'draft')}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save as Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            onClick={() => setValue('status', 'active')}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Publish Assignment
                        </Button>
                    </div>
                </div>
            </form>

            {/* Content Selector Dialog */}
            <ContentSelector
                open={showContentSelector}
                onOpenChange={setShowContentSelector}
                selectedContentIds={selectedContentIds}
                onSelectionChange={setSelectedContentIds}
            />
        </DashboardLayout>
    )
}
