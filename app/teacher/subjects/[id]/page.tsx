'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSubjectStore } from '@/store/subject-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Plus, BookOpen, FileText, Layers } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TopicCard } from '@/components/subjects/topic-card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { topicSchema, type TopicFormData } from '@/lib/validations/subject'

export default function SubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const { getSubjectById, addTopic, deleteTopic } = useSubjectStore()
    const [isAddingTopic, setIsAddingTopic] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const subject = getSubjectById(id)

    if (!subject) {
        notFound()
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TopicFormData>({
        resolver: zodResolver(topicSchema),
        defaultValues: {
            name: '',
            description: '',
            order: subject.topics.length,
        },
    })

    const handleAddTopic = async (data: TopicFormData) => {
        setIsAddingTopic(true)
        await new Promise(resolve => setTimeout(resolve, 500))

        const newTopic = {
            id: `topic-${Date.now()}`,
            subjectId: id,
            name: data.name,
            description: data.description || '',
            order: data.order,
            chapters: [],
        }

        addTopic(id, newTopic)
        reset()
        setDialogOpen(false)
        setIsAddingTopic(false)
    }

    const handleDeleteTopic = (topicId: string) => {
        if (confirm('Are you sure you want to delete this topic? All chapters will be removed.')) {
            deleteTopic(id, topicId)
        }
    }

    const topicCount = subject.topics.length
    const chapterCount = subject.topics.reduce((sum, topic) => sum + topic.chapters.length, 0)
    const contentCount = subject.topics.reduce(
        (sum, topic) => sum + topic.chapters.reduce((s, chapter) => s + chapter.contentIds.length, 0),
        0
    )

    return (
        <DashboardLayout
            role="teacher"
            title={subject.name}
            subtitle={subject.description || 'Subject details and topics'}
        >
            <div className="mb-4">
                <Link href="/teacher/subjects">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Subjects
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="topics">Topics ({topicCount})</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Subject Info Card */}
                    <Card
                        style={{ borderLeft: `4px solid ${subject.color}` }}
                    >
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                {subject.icon && (
                                    <div
                                        className="h-16 w-16 rounded-lg flex items-center justify-center text-3xl"
                                        style={{ backgroundColor: `${subject.color}20` }}
                                    >
                                        {subject.icon}
                                    </div>
                                )}
                                <div>
                                    <CardTitle className="text-2xl">{subject.name}</CardTitle>
                                    {subject.description && (
                                        <CardDescription className="mt-1">{subject.description}</CardDescription>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Topics</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold" style={{ color: subject.color }}>
                                    {topicCount}
                                </div>
                                <p className="text-xs text-muted-foreground">Learning topics</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Chapters</CardTitle>
                                <Layers className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{chapterCount}</div>
                                <p className="text-xs text-muted-foreground">Total chapters</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Content</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{contentCount}</div>
                                <p className="text-xs text-muted-foreground">Linked materials</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Topics Tab */}
                <TabsContent value="topics" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">All Topics</h3>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Topic
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Topic</DialogTitle>
                                    <DialogDescription>
                                        Create a new topic for {subject.name}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit(handleAddTopic)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Topic Name *</Label>
                                        <Input
                                            id="name"
                                            {...register('name')}
                                            placeholder="e.g., Algebra"
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
                                        <Button type="submit" disabled={isAddingTopic}>
                                            {isAddingTopic ? 'Adding...' : 'Add Topic'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {subject.topics.length === 0 ? (
                        <Card className="p-12 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No topics yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create topics to organize your chapters and content
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {subject.topics
                                .sort((a, b) => a.order - b.order)
                                .map(topic => (
                                    <TopicCard
                                        key={topic.id}
                                        topic={topic}
                                        subjectId={id}
                                        onDelete={handleDeleteTopic}
                                    />
                                ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    )
}
