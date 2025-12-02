'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useContentStore } from '@/store/content-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Edit2, Trash2, Copy, Eye, Calendar, Users, Download } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default function ContentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { content: allContent, deleteContent, duplicateContent } = useContentStore()

    // Unwrap params Promise using React.use()
    const { id } = use(params)

    const content = allContent.find(c => c.id === id)

    if (!content) {
        notFound()
    }

    const handleDelete = () => {
        if (confirm(`Delete "${content.title}"?`)) {
            deleteContent(content.id)
            router.push('/teacher/content')
        }
    }

    const handleDuplicate = () => {
        duplicateContent(content.id)
        router.push('/teacher/content')
    }

    const getStatusBadge = () => {
        switch (content.status) {
            case 'published':
                return <Badge variant="secondary">Published</Badge>
            case 'draft':
                return <Badge variant="outline">Draft</Badge>
            case 'scheduled':
                return <Badge className="bg-accent/10 text-accent border-accent">Scheduled</Badge>
        }
    }

    return (
        <DashboardLayout
            role="teacher"
            title={content.title}
            subtitle={content.description}
        >
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/teacher/content">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Library
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    {getStatusBadge()}
                    <Button variant="outline" size="sm" onClick={handleDuplicate}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                    </Button>
                    <Link href={`/teacher/content/${content.id}/edit`}>
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
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Content</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Render Rich Text */}
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: content.content }}
                                    />

                                    {/* File Info for Videos/Documents */}
                                    {(content.type === 'video' || content.type === 'document') && content.fileUrl && (
                                        <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                                            <h4 className="font-semibold mb-2">Attached File</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <p className="font-medium">{content.fileName || 'File'}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {content.fileSize ? `${(content.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'}
                                                        {content.duration && ` • ${content.duration} minutes`}
                                                    </p>
                                                </div>
                                                {content.downloadEnabled && (
                                                    <Button size="sm" variant="outline">
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Tags */}
                            {content.tags.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tags</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {content.tags.map(tag => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Analytics Tab */}
                        <TabsContent value="analytics">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Content Analytics</CardTitle>
                                    <CardDescription>
                                        Performance metrics for this content
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Total Views</span>
                                            </div>
                                            <p className="text-2xl font-bold">{content.views}</p>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Batches</span>
                                            </div>
                                            <p className="text-2xl font-bold">{content.batchIds.length}</p>
                                        </div>
                                    </div>
                                    <div className="text-center text-muted-foreground py-8">
                                        <p>Detailed analytics coming soon</p>
                                        <p className="text-sm">Charts and engagement metrics will be added in Phase 11</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Comments Tab */}
                        <TabsContent value="comments">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Comments & Questions</CardTitle>
                                    <CardDescription>
                                        Student feedback and discussions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {content.commentsEnabled ? (
                                        <div className="text-center text-muted-foreground py-8">
                                            <p>No comments yet</p>
                                            <p className="text-sm">Comments feature will be implemented in Phase 9</p>
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">
                                            <p>Comments are disabled for this content</p>
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
                                <Badge variant="outline">{content.type}</Badge>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                                <p className="text-sm">{content.category}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                                {getStatusBadge()}
                            </div>

                            {content.scheduledAt && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Scheduled For</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        {format(content.scheduledAt, 'PPP')}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Created</p>
                                <p className="text-sm">{format(content.createdAt, 'PPP')}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                                <p className="text-sm">{format(content.updatedAt, 'PPP')}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Views</p>
                                <p className="text-sm">{content.views} views</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Settings</p>
                                <div className="space-y-1 text-sm">
                                    <p>Comments: <span className="font-medium">{content.commentsEnabled ? 'Enabled' : 'Disabled'}</span></p>
                                    <p>Download: <span className="font-medium">{content.downloadEnabled ? 'Enabled' : 'Disabled'}</span></p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Batches ({content.batchIds.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                {content.batchIds.map(batchId => (
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

            <style jsx global>{`
                .prose h1 { font-size: 1.875rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 1rem; }
                .prose h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.75rem; }
                .prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; }
                .prose p { margin-bottom: 1rem; line-height: 1.75; }
                .prose ul, .prose ol { margin-bottom: 1rem; padding-left: 1.5rem; }
                .prose li { margin-bottom: 0.5rem; }
                .prose pre { background: hsl(var(--muted)); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; }
                .prose code { background: hsl(var(--muted)); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875em; }
                .prose a { color: hsl(var(--primary)); text-decoration: underline; }
            `}</style>
        </DashboardLayout>
    )
}
