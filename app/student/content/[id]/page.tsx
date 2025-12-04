'use client'

import { use } from 'react'
import { useContentStore } from '@/store/content-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Eye, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

export default function StudentContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { content: allContent } = useContentStore()

    const content = allContent.find(c => c.id === id)

    if (!content || content.status !== 'published') {
        notFound()
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video': return 'text-purple-600'
            case 'document': return 'text-blue-600'
            case 'lesson': return 'text-green-600'
            case 'quiz': return 'text-orange-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <DashboardLayout
            role="student"
            title={content.title}
            subtitle={content.category}
        >
            <div className="mb-4">
                <Link href="/student/content">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Content
                    </Button>
                </Link>
            </div>

            {/* Content Header */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={getTypeColor(content.type)}>
                                    {content.type}
                                </Badge>
                                <Badge variant="outline">{content.category}</Badge>
                                {content.tags.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                            <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
                            <p className="text-muted-foreground">{content.description}</p>
                        </div>
                        {content.downloadEnabled && content.fileUrl && (
                            <Button>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(content.createdAt, 'PPP')}
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {content.views} views
                        </div>
                        {content.type === 'video' && content.duration && (
                            <div className="flex items-center gap-1">
                                <span>{content.duration} minutes</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Video Player (if video) */}
            {content.type === 'video' && content.fileUrl && (
                <Card className="mb-6">
                    <CardContent className="p-0">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                            <p className="text-white">
                                Video player will be integrated here
                                <br />
                                <span className="text-sm text-gray-400">{content.fileName}</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Document Viewer (if document) */}
            {content.type === 'document' && content.fileUrl && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Document</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-8 bg-muted rounded-lg text-center">
                            <p className="text-muted-foreground mb-4">
                                Document viewer will be integrated here
                            </p>
                            <div className="text-sm">
                                <p className="font-medium">{content.fileName}</p>
                                <p className="text-muted-foreground">
                                    {content.fileSize ? `${(content.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Content Body */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                </CardContent>
            </Card>

            {/* Comments Section (if enabled) */}
            {content.commentsEnabled && (
                <Card>
                    <CardHeader>
                        <CardTitle>Discussion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-center py-8">
                            Comments feature coming soon
                        </p>
                    </CardContent>
                </Card>
            )}
        </DashboardLayout>
    )
}
