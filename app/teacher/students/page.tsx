'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Search,
    Filter,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react'

const students = [
    {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        batches: ['Mathematics - Batch A', 'Physics - Batch B'],
        performance: 92,
        attendance: 98,
        status: 'active',
        joined: '2024-09-01',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
    },
    {
        id: 2,
        name: 'Bob Williams',
        email: 'bob@example.com',
        batches: ['Mathematics - Batch A'],
        performance: 85,
        attendance: 95,
        status: 'active',
        joined: '2024-09-05',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    },
    {
        id: 3,
        name: 'Carol Davis',
        email: 'carol@example.com',
        batches: ['Chemistry - Batch C'],
        performance: 88,
        attendance: 92,
        status: 'active',
        joined: '2024-09-10',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol'
    },
    {
        id: 4,
        name: 'David Miller',
        email: 'david@example.com',
        batches: ['Physics - Batch B', 'Chemistry - Batch C'],
        performance: 90,
        attendance: 96,
        status: 'active',
        joined: '2024-08-20',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
    },
    {
        id: 5,
        name: 'Emma Wilson',
        email: 'emma@example.com',
        batches: ['Biology - NEET Prep'],
        performance: 83,
        attendance: 90,
        status: 'active',
        joined: '2024-09-15',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
    },
]

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getPerformanceTrend = (performance: number) => {
        if (performance >= 90) return { icon: TrendingUp, color: 'text-secondary', label: 'Excellent' }
        if (performance >= 75) return { icon: Minus, color: 'text-primary', label: 'Good' }
        return { icon: TrendingDown, color: 'text-destructive', label: 'Needs Attention' }
    }

    return (
        <DashboardLayout role="teacher" title="Students" subtitle="Manage your students across all batches">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-sm text-muted-foreground">Total Students</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold">
                            {Math.round(students.reduce((acc, s) => acc + s.performance, 0) / students.length)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Avg. Performance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-2xl font-bold">
                            {Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%
                        </div>
                        <p className="text-sm text-muted-foreground">Avg. Attendance</p>
                    </CardContent>
                </Card>
            </div>

            {/* Student List */}
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {filteredStudents.map((student) => {
                            const trend = getPerformanceTrend(student.performance)
                            const TrendIcon = trend.icon

                            return (
                                <div key={student.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={student.avatar} />
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium truncate">{student.name}</p>
                                            <Badge variant="outline" className="text-xs">{student.status}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {student.batches.slice(0, 2).map((batch, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                    {batch}
                                                </Badge>
                                            ))}
                                            {student.batches.length > 2 && (
                                                <span className="text-xs text-muted-foreground">
                                                    +{student.batches.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 text-sm">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1">
                                                <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                                                <span className="font-medium">{student.performance}%</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Performance</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">{student.attendance}%</p>
                                            <p className="text-xs text-muted-foreground">Attendance</p>
                                        </div>
                                    </div>

                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/teacher/students/${student.id}`}>
                                            View Profile
                                        </Link>
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Empty State */}
            {filteredStudents.length === 0 && (
                <Card className="p-12 text-center">
                    <h3 className="text-lg font-semibold mb-2">No students found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search terms
                    </p>
                </Card>
            )}
        </DashboardLayout>
    )
}
