'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContentStore } from '@/store/content-store'
import { contentSchema, type ContentFormData } from '@/lib/validations/content'
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
import { FileUpload } from '@/components/content/file-upload'
import { Save, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIES, COMMON_TAGS } from '@/lib/mock-data/content'
import { notFound } from 'next/navigation'

export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { content: allContent, updateContent } = useContentStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Unwrap params Promise using React.use()
    const { id } = use(params)

    const content = allContent.find(c => c.id === id)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ContentFormData>({
        resolver: zodResolver(contentSchema),
        defaultValues: content ? {
            title: content.title,
            description: content.description,
            type: content.type,
            category: content.category,
            tags: content.tags,
            content: content.content,
            fileUrl: content.fileUrl || '',
            fileName: content.fileName || '',
            fileSize: content.fileSize || 0,
            status: content.status,
            batchIds: content.batchIds,
            commentsEnabled: content.commentsEnabled,
            downloadEnabled: content.downloadEnabled,
        } : undefined,
    })

    if (!content) {
        notFound()
    }

    const contentType = watch('type')

    const onSubmit: SubmitHandler<ContentFormData> = async (data) => {
        setIsSubmitting(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        updateContent(id, data)
        router.push(`/teacher/content/${id}`)
    }

    return (
        <DashboardLayout
            role="teacher"
            title={`Edit: ${content.title}`}
            subtitle="Update your content"
        >
            <div className="mb-4">
                <Link href={`/teacher/content/${id}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Content
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
                                    Update the essential details for your content
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
                                        placeholder="Brief description of the content..."
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label>Content Type *</Label>
                                        <Select
                                            value={contentType}
                                            onValueChange={(value: any) => setValue('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lesson">Lesson</SelectItem>
                                                <SelectItem value="video">Video</SelectItem>
                                                <SelectItem value="document">Document</SelectItem>
                                                <SelectItem value="quiz">Quiz</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                            value={watch('category')}
                                            onValueChange={(value) => setValue('category', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input
                                        id="tags"
                                        defaultValue={content.tags.join(', ')}
                                        placeholder="beginner, notes, practice"
                                        onChange={(e) => {
                                            const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                            setValue('tags', tags)
                                        }}
                                    />
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
                                    Update your {contentType} content
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
                                        <Label>Update File (optional)</Label>
                                        <FileUpload
                                            type={contentType}
                                            onFileSelect={(file) => {
                                                setValue('fileUrl', URL.createObjectURL(file))
                                                setValue('fileName', file.name)
                                                setValue('fileSize', file.size)
                                            }}
                                        />
                                        {content.fileName && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                Current file: {content.fileName}
                                            </p>
                                        )}
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
                                        value={watch('status')}
                                        onValueChange={(value: any) => setValue('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Batch Selection */}
                                <div className="space-y-2">
                                    <Label>Batches *</Label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value="batch-1"
                                                defaultChecked={content.batchIds.includes('batch-1')}
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
                                                defaultChecked={content.batchIds.includes('batch-2')}
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
                                                defaultChecked={content.batchIds.includes('batch-3')}
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
                                </div>

                                {/* Toggles */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            {...register('commentsEnabled')}
                                        />
                                        <span>Enable comments</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            {...register('downloadEnabled')}
                                        />
                                        <span>Allow downloads</span>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
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
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {isSubmitting ? 'Saving...' : 'Update Content'}
                        </Button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    )
}
