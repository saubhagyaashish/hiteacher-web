'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContentStore } from '@/store/content-store'
import { contentSchema, type ContentFormData } from '@/lib/validations/content'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { FileUpload } from '@/components/content/file-upload'
import { Save, Send, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIES, COMMON_TAGS } from '@/lib/mock-data/content'
import { useAuthStore } from '@/store/auth-store'

export default function NewContentPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const { addContent } = useContentStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ContentFormData>({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            title: '',
            description: '',
            type: 'lesson',
            category: '',
            tags: [],
            content: '',
            fileUrl: '',
            fileName: '',
            fileSize: 0,
            status: 'draft',
            batchIds: [],
            commentsEnabled: true,
            downloadEnabled: true,
        },
    })

    const contentType = watch('type')

    const onSubmit: SubmitHandler<ContentFormData> = async (data) => {
        setIsSubmitting(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newContent = {
            id: `content-${Date.now()}`,
            ...data,
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            teacherId: user?.id || 'teacher-1',
        }

        addContent(newContent)
        router.push('/teacher/content')
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Create Content"
            subtitle="Add new learning material for your students"
        >
            <div className="mb-4">
                <Link href="/teacher/content">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Library
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Provide the essential details for your content
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        {...register('title')}
                                        placeholder="e.g., Introduction to Algebra"
                                        className="h-11"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        {...register('description')}
                                        placeholder="Brief description of the content..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label>Content Type *</Label>
                                        <Select
                                            value={contentType}
                                            onValueChange={(value: any) => setValue('type', value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lesson">Lesson</SelectItem>
                                                <SelectItem value="video">Video</SelectItem>
                                                <SelectItem value="document">Document</SelectItem>
                                                <SelectItem value="quiz">Quiz</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-destructive">{errors.type.message}</p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                            onValueChange={(value) => setValue('category', value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-sm text-destructive">{errors.category.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input
                                        id="tags"
                                        placeholder="beginner, notes, practice"
                                        className="h-11"
                                        onChange={(e) => {
                                            const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                            setValue('tags', tags)
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Suggested: {COMMON_TAGS.slice(0, 5).join(', ')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Content Tab */}
                    <TabsContent value="content" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Editor</CardTitle>
                                <CardDescription>
                                    {contentType === 'lesson' && 'Write your lesson content using the rich text editor'}
                                    {contentType === 'video' && 'Add video description and upload video file'}
                                    {contentType === 'document' && 'Add document description and upload file'}
                                    {contentType === 'quiz' && 'Add quiz description (quiz builder coming soon)'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ContentEditor
                                    value={watch('content') || ''}
                                    onChange={(value) => setValue('content', value)}
                                />
                                {errors.content && (
                                    <p className="text-sm text-destructive">{errors.content.message}</p>
                                )}

                                {(contentType === 'video' || contentType === 'document') && (
                                    <div className="pt-4">
                                        <Label>Upload File</Label>
                                        <FileUpload
                                            type={contentType}
                                            onFileSelect={(file) => {
                                                setValue('fileUrl', URL.createObjectURL(file))
                                                setValue('fileName', file.name)
                                                setValue('fileSize', file.size)
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publishing Settings</CardTitle>
                                <CardDescription>
                                    Control how and when your content is published
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Status */}
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        defaultValue="draft"
                                        onValueChange={(value: any) => setValue('status', value)}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Batch Selection (Mock) */}
                                <div className="space-y-2">
                                    <Label>Batches *</Label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value="batch-1"
                                                className="w-4 h-4"
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
                                                className="w-4 h-4"
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
                                                className="w-4 h-4"
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

                                {/* Toggles */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-4 h-4"
                                            {...register('commentsEnabled')}
                                        />
                                        <span>Enable comments</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-4 h-4"
                                            {...register('downloadEnabled')}
                                        />
                                        <span>Allow downloads</span>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons - Mobile Responsive */}
                <div className="flex flex-col gap-3 pt-6 border-t sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="w-full sm:w-auto h-11"
                    >
                        Cancel
                    </Button>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() => setValue('status', 'draft')}
                            className="w-full sm:w-auto h-11"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save as Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            onClick={() => setValue('status', 'published')}
                            className="w-full sm:w-auto h-11"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Publish Now
                        </Button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    )
}
