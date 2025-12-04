'use client'

import { Content } from '@/types/content'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Video, FileText, ExternalLink, X } from 'lucide-react'
import Link from 'next/link'

interface LinkedContentCardProps {
    content: Content
    onRemove?: () => void
    compact?: boolean
}

export function LinkedContentCard({ content, onRemove, compact = false }: LinkedContentCardProps) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return Video
            case 'document': return FileText
            case 'lesson': return BookOpen
            default: return FileText
        }
    }

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'video': return 'bg-purple-500/10 text-purple-600'
            case 'document': return 'bg-blue-500/10 text-blue-600'
            case 'lesson': return 'bg-green-500/10 text-green-600'
            case 'quiz': return 'bg-orange-500/10 text-orange-600'
            default: return ''
        }
    }

    const TypeIcon = getTypeIcon(content.type)

    if (compact) {
        return (
            <div className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`h-8 w-8 rounded flex items-center justify-center ${getTypeBadgeColor(content.type)}`}>
                    <TypeIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{content.title}</p>
                </div>
                {onRemove && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        )
    }

    return (
        <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${getTypeBadgeColor(content.type)}`}>
                        <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className={getTypeBadgeColor(content.type)} variant="secondary">
                                {content.type}
                            </Badge>
                            <Badge variant="outline">{content.category}</Badge>
                        </div>
                        <h4 className="font-medium line-clamp-1 mb-1">{content.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {content.description}
                        </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <Link href={`/teacher/content/${content.id}`} target="_blank">
                            <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </Link>
                        {onRemove && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onRemove}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
