'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useClassStore } from '@/store/class-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { ScheduleWidget } from '@/components/classes/schedule-widget'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    BookOpen,
    Calendar,
    Award,
    Clock,
    FileText,
    Video,
    TrendingUp,
    Play
} from 'lucide-react'

export default function StudentDashboard() {
    const router = useRouter()
    const { user } = useAuthStore()
    const { getUpcomingClasses } = useClassStore()

    useEffect(() => {
        if (!user || user.role !== 'student') {
            router.push('/login')
        }
    }, [user, router])

    if (!user) return null

    const upcomingClasses = getUpcomingClasses(5)

    const upcomingAssignments = [
        {
            id: 1,
            title: 'Physics Homework #6',
            course: 'Advanced Physics',
            dueDate: 'Due Tomorrow',
            status: 'pending' as const,
            urgent: true
        },
        {
            id: 2,
            title: 'Math Quiz 4',
            course: 'Mathematics',
            dueDate: 'Due in 3 days',
            status: 'pending' as const,
            urgent: false
        },
        {
            id: 3,
            title: 'Chemistry Lab Report',
            course: 'Chemistry',
            dueDate: 'Due in 5 days',
            status: 'in-progress' as const,
            urgent: false
        },
    ]

    const recentContent = [
        { title: 'Thermodynamics Chapter 5', type: 'PDF', course: 'Physics', added: '2 hours ago' },
        { title: 'Calculus Video Tutorial', type: 'Video', course: 'Mathematics', added: '1 day ago' },
        { title: 'Organic Chemistry Notes', type: 'PDF', course: 'Chemistry', added: '2 days ago' },
    ]

    const todaySchedule = [
        { time: '10:00 AM', title: 'Physics - Mechanics', teacher: 'John Doe', status: 'upcoming' },
        { time: '2:00 PM', title: 'Mathematics - Calculus', teacher: 'Sarah Smith', status: 'upcoming' },
    ]

    return (
        <DashboardLayout role="student" title="Student Dashboard" subtitle={`Welcome, ${user.name}!`}>
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <StatCard
                    title="My Courses"
                    value="2"
                    description="Active enrollments"
                    icon={BookOpen}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Upcoming Classes"
                    value="5"
                    description="This week"
                    icon={Calendar}
                    iconColor="text-secondary"
                />
                <StatCard
                    title="Overall Progress"
                    value="78%"
                    trend={{ value: 5, isPositive: true }}
                    description="Keep it up!"
                    icon={Award}
                    iconColor="text-accent"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
                {/* Today's Schedule */}
                <ScheduleWidget
                    classes={upcomingClasses}
                    role="student"
                    title="Upcoming Classes"
                    limit={5}
                />

                {/* Upcoming Assignments */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Upcoming Assignments</CardTitle>
                            <Badge variant="destructive">1 urgent</Badge>
                        </div>
                        <CardDescription>Pending assignments and quizzes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingAssignments.map((assignment) => (
                                <div key={assignment.id} className="flex items-start gap-3">
                                    <div className={`h-2 w-2 rounded-full mt-2 ${assignment.urgent ? 'bg-destructive' : 'bg-primary'}`} />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{assignment.title}</p>
                                        <p className="text-xs text-muted-foreground">{assignment.course}</p>
                                        <p className={`text-xs font-medium ${assignment.urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
                                            {assignment.dueDate}
                                        </p>
                                    </div>
                                    <Button size="sm" variant={assignment.status === 'in-progress' ? 'default' : 'outline'}>
                                        {assignment.status === 'in-progress' ? 'Continue' : 'Start'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            View All Assignments
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Course Progress */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                    <CardDescription>Your learning journey across enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3 p-4 rounded-lg border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Advanced Physics</p>
                                    <p className="text-sm text-muted-foreground">John Doe</p>
                                </div>
                                <Badge variant="secondary">85%</Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">17/20 topics</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Grade: A-</span>
                                <Button size="sm" variant="outline">Continue</Button>
                            </div>
                        </div>

                        <div className="space-y-3 p-4 rounded-lg border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Mathematics</p>
                                    <p className="text-sm text-muted-foreground">Sarah Smith</p>
                                </div>
                                <Badge variant="secondary">72%</Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">13/18 topics</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-secondary h-2 rounded-full" style={{ width: '72%' }} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Grade: B+</span>
                                <Button size="sm" variant="outline">Continue</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Recently Added Content</CardTitle>
                    <CardDescription>New materials from your teachers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentContent.map((content, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:border-primary/40 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    {content.type === 'Video' ? (
                                        <Video className="h-5 w-5 text-primary" />
                                    ) : (
                                        <FileText className="h-5 w-5 text-secondary" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{content.title}</p>
                                    <p className="text-sm text-muted-foreground">{content.course}</p>
                                    <p className="text-xs text-muted-foreground">{content.added}</p>
                                </div>
                                <Button size="sm" variant="outline">View</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
