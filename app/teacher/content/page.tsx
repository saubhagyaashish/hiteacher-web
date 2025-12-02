'use client'

import { useState, useMemo } from 'react'
import { useContentStore } from '@/store/content-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Grid3x3, List, BookOpen, Video, FileText, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/mock-data/content'
import { ContentCard } from '@/components/content/content-card'

export default function ContentLibraryPage() {
    const {
        filters,
        viewMode,
        setFilters,
        setViewMode,
        getFilteredContent,
        getStats,
    } = useContentStore()

    const filteredContent = useMemo(() => getFilteredContent(), [filters, getFilteredContent])
    const stats = useMemo(() => getStats(), [getStats])

    return (
        <DashboardLayout
            role="teacher"
            title="Content Library"
            subtitle="Manage your learning materials and resources"
        >
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All materials</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary">{stats.published}</div>
                        <p className="text-xs text-muted-foreground">Live content</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.drafts}</div>
                        <p className="text-xs text-muted-foreground">Work in progress</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search content..."
                        value={filters.search || ''}
                        onChange={(e) => setFilters({ search: e.target.value })}
                        className="pl-9"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <Select
                        value={filters.type || 'all'}
                        onValueChange={(value) => setFilters({ type: value as any })}
                    >
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

                    <Select
                        value={filters.category || 'all'}
                        onValueChange={(value) => setFilters({ category: value })}
                    >
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

                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => setFilters({ status: value as any })}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-1 border rounded-md p-1">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                {/* Create Button */}
                <Link href="/teacher/content/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Content
                    </Button>
                </Link>
            </div>

            {/* Content Grid/List */}
            {filteredContent.length === 0 ? (
                <Card className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No content found</h3>
                    <p className="text-muted-foreground mb-4">
                        {filters.search || filters.type !== 'all' || filters.category !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Get started by creating your first content'}
                    </p>
                    <Link href="/teacher/content/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Content
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className={
                    viewMode === 'grid'
                        ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
                        : 'space-y-4'
                }>
                    {filteredContent.map(content => (
                        <ContentCard
                            key={content.id}
                            content={content}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}
