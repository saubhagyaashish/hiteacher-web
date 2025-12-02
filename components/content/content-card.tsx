'use client'

import { Content, ViewMode } from '@/types/content'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BookOpen, Video, FileText, ClipboardList, MoreVertical, Eye, Edit2, Copy, Trash2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useContentStore } from '@/store/content-store'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ContentCardProps {
    content: Content
    viewMode: ViewMode
}

export function ContentCard({ content, viewMode }: ContentCardProps) {
    const { deleteContent, duplicateContent } = useContentStore()

    const getTypeIcon = () => {
        switch (content.type) {
            case 'lesson':
                return <BookOpen className="h-5 w-5" />
            case 'video':
                return <Video className="h-5 w-5" />
            case 'document':
                return <FileText className="h-5 w-5" />
            case 'quiz':
                return <ClipboardList className="h-5 w-5" />
        }
    }

    const getTypeColor = () => {
        switch (content.type) {
            case 'lesson':
                return 'bg-primary/10 text-primary'
            case 'video':
                return 'bg-secondary/10 text-secondary'
            case 'document':
                return 'bg-accent/10 text-accent'
            case 'quiz':
                return 'bg-destructive/10 text-destructive'
        }
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

    const handleDelete = () => {
        if (confirm(`Delete "${content.title}"?`)) {
            deleteContent(content.id)
        }
    }

    const handleDuplicate = () => {
        duplicateContent(content.id)
    }

    if (viewMode === 'list') {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", getTypeColor())}>
                            {getTypeIcon()}
                        </div>

                        {/* Content Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold truncate">{content.title}</h3>
                                {getStatusBadge()}
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-1">
                                {content.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{content.category}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {content.views}
                                </span>
                                <span>•</span>
                                <span>{format(content.createdAt, 'MMM d, yyyy')}</span>
                                {content.duration && (
                                    <>
                                        <span>•</span>
                                        <span>{content.duration} min</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/teacher/content/${content.id}`}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/teacher/content/${content.id}/edit`}>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDuplicate}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Grid view
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between mb-2">
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", getTypeColor())}>
                        {getTypeIcon()}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/teacher/content/${content.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/teacher/content/${content.id}/edit`}>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDuplicate}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardTitle className="line-clamp-2">{content.title}</CardTitle>
                <CardDescription className="line-clamp-2">{content.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-3">
                    {getStatusBadge()}
                    <Badge variant="outline" className="text-xs">{content.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {content.views}
                    </span>
                    {content.duration && <span>{content.duration} min</span>}
                    <span>{format(content.createdAt, 'MMM d')}</span>
                </div>
            </CardContent>
        </Card>
    )
}
