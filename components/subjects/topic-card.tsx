'use client'

import { Topic } from '@/types/content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, BookOpen, FileText, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopicCardProps {
    topic: Topic
    subjectId: string
    onDelete?: (topicId: string) => void
}

export function TopicCard({ topic, subjectId, onDelete }: TopicCardProps) {
    const chapterCount = topic.chapters.length
    const contentCount = topic.chapters.reduce((sum, chapter) => sum + chapter.contentIds.length, 0)

    return (
        <Card className="hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex-1">
                    <Link href={`/teacher/subjects/${subjectId}/topics/${topic.id}`}>
                        <CardTitle className="text-lg hover:underline cursor-pointer">
                            {topic.name}
                        </CardTitle>
                    </Link>
                    {topic.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {topic.description}
                        </p>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete?.(topic.id)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {chapterCount} {chapterCount === 1 ? 'Chapter' : 'Chapters'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {contentCount} Content
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
