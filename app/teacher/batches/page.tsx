'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Search,
    Users,
    Calendar,
    BookOpen,
    MoreVertical,
    TrendingUp
} from 'lucide-react'

// Mock batch data
const batches = [
    {
        id: 1,
        name: 'Advanced Mathematics - Batch A',
        subject: 'Mathematics',
        description: 'Advanced calculus and algebra for grade 12',
        students: 25,
        maxStudents: 30,
        schedule: 'Mon, Wed, Fri - 10:00 AM',
        nextClass: '2024-12-02 10:00',
        performance: 87,
        status: 'active' as const,
        color: 'bg-primary'
    },
    {
        id: 2,
        name: 'Physics - Mechanics',
        subject: 'Physics',
        description: 'Classical mechanics and dynamics',
        students: 30,
        maxStudents: 30,
        schedule: 'Tue, Thu - 2:00 PM',
        nextClass: '2024-12-03 14:00',
        performance: 82,
        status: 'active' as const,
        color: 'bg-secondary'
    },
    {
        id: 3,
        name: 'Chemistry - Organic',
        subject: 'Chemistry',
        description: 'Organic chemistry fundamentals',
        students: 20,
        maxStudents: 25,
        schedule: 'Mon, Wed - 3:00 PM',
        nextClass: '2024-12-02 15:00',
        performance: 91,
        status: 'active' as const,
        color: 'bg-accent'
    },
    {
        id: 4,
        name: 'Biology - NEET Prep',
        subject: 'Biology',
        description: 'NEET exam preparation batch',
        students: 18,
        maxStudents: 20,
        schedule: 'Tue, Thu, Sat - 9:00 AM',
        nextClass: '2024-12-03 09:00',
        performance: 85,
        status: 'active' as const,
        color: 'bg-primary'
    },
]

export default function BatchesPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredBatches = batches.filter(batch =>
        batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <DashboardLayout role="teacher" title="Batch Management" subtitle="Manage your batches and classes">
            {/* Header Actions - Responsive */}
            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 w-full sm:max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search batches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-11"
                        />
                    </div>
                </div>
                <Button asChild className="w-full sm:w-auto h-11">
                    <Link href="/teacher/batches/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Batch
                    </Link>
                </Button>
            </div>

            {/* Stats Overview - Responsive Grid */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 md:gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batches.length}</div>
                        <p className="text-xs text-muted-foreground">Active batches</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {batches.reduce((acc, b) => acc + b.students, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all batches
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Capacity</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round((batches.reduce((acc, b) => acc + b.students, 0) / batches.reduce((acc, b) => acc + b.maxStudents, 0)) * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Overall utilization</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(batches.reduce((acc, b) => acc + b.performance, 0) / batches.length)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Across all batches</p>
                    </CardContent>
                </Card>
            </div>

            {/* Batch Grid - Responsive: 1 → 2 → 3 columns */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {filteredBatches.map((batch) => (
                    <Card key={batch.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`h-3 w-3 rounded-full ${batch.color}`} />
                                        <Badge variant="secondary">{batch.subject}</Badge>
                                    </div>
                                    <CardTitle className="text-lg mb-1">{batch.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {batch.description}
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Student Progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Students</span>
                                    <span className="font-medium">
                                        {batch.students}/{batch.maxStudents}
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${batch.color}`}
                                        style={{ width: `${(batch.students / batch.maxStudents) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{batch.schedule}</span>
                            </div>

                            {/* Performance */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Avg. Performance</span>
                                <Badge variant="outline" className="font-semibold">
                                    {batch.performance}%
                                </Badge>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <Button asChild className="flex-1 h-10" size="sm">
                                    <Link href={`/teacher/batches/${batch.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-10" size="sm">
                                    <Link href={`/teacher/batches/${batch.id}/edit`}>
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredBatches.length === 0 && (
                <Card className="p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No batches found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery
                            ? 'Try adjusting your search terms'
                            : 'Get started by creating your first batch'}
                    </p>
                    {!searchQuery && (
                        <Button asChild>
                            <Link href="/teacher/batches/new">
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Batch
                            </Link>
                        </Button>
                    )}
                </Card>
            )}
        </DashboardLayout>
    )
}
