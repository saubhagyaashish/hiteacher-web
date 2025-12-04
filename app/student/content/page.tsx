'use client'

import { useState, useMemo } from 'react'
import { useContentStore } from '@/store/content-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, BookOpen, Video, FileText } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/mock-data/content'
import { Badge } from '@/components/ui/badge'

// Mock current student's batch IDs
const CURRENT_STUDENT_BATCHES = ['batch-1', 'batch-2']

export default function StudentContentPage() {
    const { getFilteredContent, filters, setFilters } = useContentStore()
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    // Filter content for student - only show published content from their batches
    const studentContent = useMemo(() => {
        return getFilteredContent().filter(content =>
            content.status === 'published' &&
            content.batchIds.some(batchId => CURRENT_STUDENT_BATCHES.includes(batchId))
        )
    }, [getFilteredContent])

    const filteredContent = studentContent.filter(content => {
        const matchesSearch = search === '' ||
            content.title.toLowerCase().includes(search.toLowerCase()) ||
            content.description.toLowerCase().includes(search.toLowerCase())

        const matchesType = typeFilter === 'all' || content.type === typeFilter
        const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter

        return matchesSearch && matchesType && matchesCategory
    })

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
        <DashboardLayout
            role="student"
            title="Learning Content"
            subtitle="Browse and access your course materials"
        >
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Content</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{studentContent.length}</div>
                        <p className="text-xs text-muted-foreground">Learning materials</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Videos</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {studentContent.filter(c => c.type === 'video').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Video lectures</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Documents</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {studentContent.filter(c => c.type === 'document').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Study materials</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="lesson">Lessons</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                        <SelectItem value="quiz">Quizzes</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Content Grid */}
            {filteredContent.length === 0 ? (
                <Card className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No content found</h3>
                    <p className="text-muted-foreground">
                        {search || typeFilter !== 'all' || categoryFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'No content available yet'}
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredContent.map(content => {
                        const TypeIcon = getTypeIcon(content.type)
                        return (
                            <Link key={content.id} href={`/student/content/${content.id}`}>
                                <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <Badge className={getTypeBadgeColor(content.type)}>
                                                <TypeIcon className="h-3 w-3 mr-1" />
                                                {content.type}
                                            </Badge>
                                            <Badge variant="outline">{content.category}</Badge>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2">
                                            {content.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {content.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {content.type === 'video' && content.duration && (
                                                <span>{content.duration} min</span>
                                            )}
                                            <span>•</span>
                                            <span>{content.views} views</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </DashboardLayout>
    )
}
