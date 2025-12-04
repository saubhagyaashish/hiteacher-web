'use client'

import { Chapter } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GripVertical, FileText, Trash2, Plus } from 'lucide-react'

interface ChapterListProps {
    chapters: Chapter[]
    subjectId: string
    topicId: string
    onDelete?: (chapterId: string) => void
    onAddContent?: (chapterId: string) => void
}

export function ChapterList({ chapters, subjectId, topicId, onDelete, onAddContent }: ChapterListProps) {
    if (chapters.length === 0) {
        return (
            <Card className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No chapters yet</h3>
                <p className="text-muted-foreground">
                    Create chapters to organize your content
                </p>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            {chapters.map((chapter, index) => (
                <Card key={chapter.id} className="hover:shadow-md transition-all">
                    <CardContent className="flex items-center gap-4 p-4">
                        {/* Drag Handle */}
                        <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
                            <GripVertical className="h-5 w-5" />
                        </div>

                        {/* Order Number */}
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {index + 1}
                        </div>

                        {/* Chapter Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold">{chapter.name}</h4>
                            {chapter.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                    {chapter.description}
                                </p>
                            )}
                        </div>

                        {/* Content Count */}
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {chapter.contentIds.length}
                        </Badge>

                        {/* Actions */}
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onAddContent?.(chapter.id)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete?.(chapter.id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
