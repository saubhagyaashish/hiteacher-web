'use client'

import { useState, useMemo } from 'react'
import { useContentStore } from '@/store/content-store'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { Search, BookOpen, Video, FileText, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { CATEGORIES } from '@/lib/mock-data/content'

interface ContentSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedContentIds: string[]
    onSelectionChange: (contentIds: string[]) => void
}

export function ContentSelector({
    open,
    onOpenChange,
    selectedContentIds,
    onSelectionChange,
}: ContentSelectorProps) {
    const { getFilteredContent } = useContentStore()
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const allContent = getFilteredContent()

    const filteredContent = useMemo(() => {
        return allContent.filter(content => {
            const matchesSearch = search === '' ||
                content.title.toLowerCase().includes(search.toLowerCase())

            const matchesType = typeFilter === 'all' || content.type === typeFilter
            const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter

            return matchesSearch && matchesType && matchesCategory && content.status === 'published'
        })
    }, [allContent, search, typeFilter, categoryFilter])

    const toggleContent = (contentId: string) => {
        if (selectedContentIds.includes(contentId)) {
            onSelectionChange(selectedContentIds.filter(id => id !== contentId))
        } else {
            onSelectionChange([...selectedContentIds, contentId])
        }
    }

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Link Content to Assignment</DialogTitle>
                    <DialogDescription>
                        Select learning materials students should review before completing this assignment
                    </DialogDescription>
                </DialogHeader>

                {/* Filters */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search content..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="lesson">Lessons</SelectItem>
                            <SelectItem value="video">Videos</SelectItem>
                            <SelectItem value="document">Documents</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Selected Count */}
                {selectedContentIds.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                        {selectedContentIds.length} item{selectedContentIds.length !== 1 ? 's' : ''} selected
                    </div>
                )}

                {/* Content List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {filteredContent.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No content found
                        </div>
                    ) : (
                        filteredContent.map(content => {
                            const TypeIcon = getTypeIcon(content.type)
                            const isSelected = selectedContentIds.includes(content.id)

                            return (
                                <Card
                                    key={content.id}
                                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => toggleContent(content.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleContent(content.id)}
                                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className={getTypeBadgeColor(content.type)} variant="secondary">
                                                    <TypeIcon className="h-3 w-3 mr-1" />
                                                    {content.type}
                                                </Badge>
                                                <Badge variant="outline">{content.category}</Badge>
                                            </div>
                                            <h4 className="font-medium line-clamp-1">{content.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {content.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center border-t pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectionChange([])}
                        disabled={selectedContentIds.length === 0}
                    >
                        Clear All
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
