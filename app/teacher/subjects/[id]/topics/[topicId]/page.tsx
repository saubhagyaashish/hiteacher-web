'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSubjectStore } from '@/store/subject-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Plus, FileText, Layers } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChapterList } from '@/components/subjects/chapter-list'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { chapterSchema, type ChapterFormData } from '@/lib/validations/subject'

export default function TopicDetailPage({ params }: { params: Promise<{ id: string, topicId: string }> }) {
    const router = useRouter()
    const { id, topicId } = use(params)
    const { getSubjectById, getTopicById, addChapter, deleteChapter } = useSubjectStore()
    const [isAddingChapter, setIsAddingChapter] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const subject = getSubjectById(id)
    const topic = subject?.topics.find(t => t.id === topicId)

    if (!subject || !topic) {
        notFound()
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChapterFormData>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: '',
            description: '',
            order: topic.chapters.length,
            contentIds: [],
        },
    })

    const handleAddChapter = async (data: ChapterFormData) => {
        setIsAddingChapter(true)
        await new Promise(resolve => setTimeout(resolve, 500))

        const newChapter = {
            id: `chapter-${Date.now()}`,
            topicId: topicId,
            name: data.name,
            description: data.description || '',
            order: data.order,
            contentIds: [],
        }

        addChapter(id, topicId, newChapter)
        reset()
        setDialogOpen(false)
        setIsAddingChapter(false)
    }

    const handleDeleteChapter = (chapterId: string) => {
        if (confirm('Are you sure you want to delete this chapter?')) {
            deleteChapter(id, topicId, chapterId)
        }
    }

    const chapterCount = topic.chapters.length
    const contentCount = topic.chapters.reduce((sum, chapter) => sum + chapter.contentIds.length, 0)

    return (
        <DashboardLayout
            role="teacher"
            title={topic.name}
            subtitle={`${subject.name} • ${topic.description || 'Topic chapters'}`}
        >
            <div className="mb-4">
                <Link href={`/teacher/subjects/${id}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to {subject.name}
                    </Button>
                </Link>
            </div>

            {/* Topic Info Card */}
            <Card className="mb-6" style={{ borderLeft: `4px solid ${subject.color}` }}>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        {subject.icon && (
                            <div
                                className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl"
                                style={{ backgroundColor: `${subject.color}20` }}
                            >
                                {subject.icon}
                            </div>
                        )}
                        <div className="flex-1">
                            <CardTitle className="text-xl">{topic.name}</CardTitle>
                            {topic.description && (
                                <CardDescription className="mt-1">{topic.description}</CardDescription>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chapters</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: subject.color }}>
                            {chapterCount}
                        </div>
                        <p className="text-xs text-muted-foreground">Learning chapters</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Linked Content</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{contentCount}</div>
                        <p className="text-xs text-muted-foreground">Content items</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chapters Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Chapters</h3>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Chapter
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Chapter</DialogTitle>
                                <DialogDescription>
                                    Create a new chapter for {topic.name}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleAddChapter)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Chapter Name *</Label>
                                    <Input
                                        id="name"
                                        {...register('name')}
                                        placeholder="e.g., Introduction to Algebra"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        {...register('description')}
                                        placeholder="Brief description..."
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isAddingChapter}>
                                        {isAddingChapter ? 'Adding...' : 'Add Chapter'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <ChapterList
                    chapters={topic.chapters.sort((a, b) => a.order - b.order)}
                    subjectId={id}
                    topicId={topicId}
                    onDelete={handleDeleteChapter}
                    onAddContent={(chapterId) => {
                        // TODO: Implement content selector modal
                        alert('Content selector coming in next phase!')
                    }}
                />
            </div>
        </DashboardLayout>
    )
}
