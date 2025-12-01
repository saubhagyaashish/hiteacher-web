'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    BookOpen,
    Calendar,
    TrendingUp,
    Plus,
    Upload,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'

export default function TeacherDashboard() {
    const router = useRouter()
    const { user } = useAuthStore()

    useEffect(() => {
        if (!user || user.role !== 'teacher') {
            router.push('/login')
        }
    }, [user, router])

    if (!user) return null

    const upcomingClasses = [
        {
            id: 1,
            title: 'Advanced Mathematics',
            batch: 'Batch A',
            time: 'Today, 10:00 AM',
            students: 25,
            status: 'upcoming' as const
        },
        {
            id: 2,
            title: 'Physics - Mechanics',
            batch: 'Batch B',
            time: 'Today, 2:00 PM',
            students: 30,
            status: 'upcoming' as const
        },
        {
            id: 3,
            title: 'Chemistry Lab',
            batch: 'Batch C',
            time: 'Tomorrow, 11:00 AM',
            students: 20,
            status: 'scheduled' as const
        },
    ]

    const recentSubmissions = [
        { student: 'Alice Johnson', assignment: 'Physics Homework #5', time: '15 mins ago', status: 'pending' },
        { student: 'Bob Williams', assignment: 'Math Quiz 3', time: '1 hour ago', status: 'pending' },
        { student: 'Carol Davis', assignment: 'Chemistry Lab Report', time: '3 hours ago', status: 'graded' },
    ]

    const quickActions = [
        { label: 'Create Batch', icon: Users, color: 'bg-primary' },
        { label: 'Upload Content', icon: Upload, color: 'bg-secondary' },
        { label: 'Schedule Class', icon: Calendar, color: 'bg-accent' },
        { label: 'New Assignment', icon: BookOpen, color: 'bg-primary' },
    ]

    return (
        <DashboardLayout role="teacher" title="Teacher Dashboard" subtitle={`Welcome back, ${user.name}!`}>
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                    title="Total Students"
                    value="45"
                    description="Across 3 batches"
                    icon={Users}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Active Courses"
                    value="3"
                    description="12 topics total"
                    icon={BookOpen}
                    iconColor="text-secondary"
                />
                <StatCard
                    title="Classes This Week"
                    value="8"
                    description="2 today, 6 upcoming"
                    icon={Calendar}
                    iconColor="text-accent"
                />
                <StatCard
                    title="Avg. Attendance"
                    value="92%"
                    trend={{ value: 5, isPositive: true }}
                    description="Last 30 days"
                    icon={TrendingUp}
                    iconColor="text-primary"
                />
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks to get you started</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon
                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="h-24 flex-col gap-2"
                                >
                                    <div className={`h-10 w-10 rounded-full ${action.color} flex items-center justify-center`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">{action.label}</span>
                                </Button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
                {/* Upcoming Classes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Upcoming Classes</CardTitle>
                            <Badge>{upcomingClasses.length}</Badge>
                        </div>
                        <CardDescription>Your schedule for today and tomorrow</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingClasses.map((cls) => (
                                <div key={cls.id} className="flex items-start gap-4 p-3 rounded-lg border hover:border-primary/40 transition-colors">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${cls.status === 'upcoming' ? 'bg-primary/10' : 'bg-muted'}`}>
                                        <Calendar className={`h-5 w-5 ${cls.status === 'upcoming' ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{cls.title}</p>
                                        <p className="text-sm text-muted-foreground">{cls.batch} • {cls.students} students</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Clock className="h-3 w-3" />
                                            {cls.time}
                                        </p>
                                    </div>
                                    <Button size="sm" variant={cls.status === 'upcoming' ? 'default' : 'outline'}>
                                        {cls.status === 'upcoming' ? 'Join' : 'View'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            <Calendar className="h-4 w-4 mr-2" />
                            View Full Calendar
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Submissions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Submissions</CardTitle>
                            <Badge variant="destructive">2 pending</Badge>
                        </div>
                        <CardDescription>Latest assignment submissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSubmissions.map((submission, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className={`h-2 w-2 rounded-full mt-2 ${submission.status === 'pending' ? 'bg-destructive' : 'bg-secondary'}`} />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{submission.student}</p>
                                        <p className="text-xs text-muted-foreground">{submission.assignment}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {submission.time}
                                        </p>
                                    </div>
                                    {submission.status === 'pending' ? (
                                        <Button size="sm" variant="outline">
                                            Grade
                                        </Button>
                                    ) : (
                                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            View All Submissions
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Batch Performance Overview</CardTitle>
                    <CardDescription>Average scores and attendance across your batches</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2 p-4 rounded-lg border">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Batch A - Mathematics</p>
                                <Badge variant="secondary">25 students</Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-2xl font-bold">87%</p>
                                    <p className="text-xs text-muted-foreground">Avg. Score</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">94%</p>
                                    <p className="text-xs text-muted-foreground">Attendance</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 p-4 rounded-lg border">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Batch B - Physics</p>
                                <Badge variant="secondary">30 students</Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-2xl font-bold">82%</p>
                                    <p className="text-xs text-muted-foreground">Avg. Score</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">89%</p>
                                    <p className="text-xs text-muted-foreground">Attendance</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 p-4 rounded-lg border">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Batch C - Chemistry</p>
                                <Badge variant="secondary">20 students</Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-2xl font-bold">91%</p>
                                    <p className="text-xs text-muted-foreground">Avg. Score</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">96%</p>
                                    <p className="text-xs text-muted-foreground">Attendance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
