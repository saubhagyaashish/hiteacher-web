'use client'

import { useState } from 'react'
import { useSubjectStore } from '@/store/subject-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, BookOpen, FileText, Layers } from 'lucide-react'
import Link from 'next/link'
import { SubjectCard } from '@/components/subjects/subject-card'

export default function SubjectsPage() {
    const { subjects, deleteSubject } = useSubjectStore()
    const [search, setSearch] = useState('')

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(search.toLowerCase()) ||
        subject.description?.toLowerCase().includes(search.toLowerCase())
    )

    const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0)
    const totalChapters = subjects.reduce(
        (sum, s) => sum + s.topics.reduce((t, topic) => t + topic.chapters.length, 0),
        0
    )
    const totalContent = subjects.reduce(
        (sum, s) => sum + s.topics.reduce(
            (t, topic) => t + topic.chapters.reduce((c, chapter) => c + chapter.contentIds.length, 0),
            0
        ),
        0
    )

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this subject? All topics and chapters will be removed.')) {
            deleteSubject(id)
        }
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Subjects"
            subtitle="Organize your content with subjects, topics, and chapters"
        >
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{subjects.length}</div>
                        <p className="text-xs text-muted-foreground">All subjects</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Topics</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary">{totalTopics}</div>
                        <p className="text-xs text-muted-foreground">Across all subjects</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chapters</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalChapters}</div>
                        <p className="text-xs text-muted-foreground">Total chapters</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Linked Content</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalContent}</div>
                        <p className="text-xs text-muted-foreground">Content items</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search subjects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Create Button */}
                <Link href="/teacher/subjects/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Subject
                    </Button>
                </Link>
            </div>

            {/* Subjects Grid */}
            {filteredSubjects.length === 0 ? (
                <Card className="p-12 text-center">
                    <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
                    <p className="text-muted-foreground mb-4">
                        {search
                            ? 'Try adjusting your search'
                            : 'Get started by creating your first subject'}
                    </p>
                    {!search && (
                        <Link href="/teacher/subjects/new">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Subject
                            </Button>
                        </Link>
                    )}
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSubjects.map(subject => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}
