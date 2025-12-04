'use client'

import { Subject } from '@/types/content'
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

interface SubjectCardProps {
    subject: Subject
    onDelete?: (id: string) => void
}

export function SubjectCard({ subject, onDelete }: SubjectCardProps) {
    const topicCount = subject.topics.length
    const chapterCount = subject.topics.reduce((sum, topic) => sum + topic.chapters.length, 0)
    const contentCount = subject.topics.reduce(
        (sum, topic) => sum + topic.chapters.reduce((s, chapter) => s + chapter.contentIds.length, 0),
        0
    )

    return (
        <Card
            className="hover:shadow-lg transition-all"
            style={{ borderLeft: `4px solid ${subject.color || '#3B82F6'}` }}
        >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    {subject.icon && (
                        <div
                            className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${subject.color}20` }}
                        >
                            {subject.icon}
                        </div>
                    )}
                    <div>
                        <Link href={`/teacher/subjects/${subject.id}`}>
                            <CardTitle className="text-lg hover:underline cursor-pointer">
                                {subject.name}
                            </CardTitle>
                        </Link>
                        {subject.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {subject.description}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/teacher/subjects/${subject.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete?.(subject.id)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="flex gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {topicCount} {topicCount === 1 ? 'Topic' : 'Topics'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {chapterCount} {chapterCount === 1 ? 'Chapter' : 'Chapters'}
                    </Badge>
                    <Badge variant="outline">
                        {contentCount} Content
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
