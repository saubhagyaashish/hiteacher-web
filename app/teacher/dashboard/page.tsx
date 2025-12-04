import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useAssignmentStore } from '@/store/assignment-store'
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
    AlertCircle,
    ClipboardList
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function TeacherDashboard() {
    const router = useRouter()
    const { user } = useAuthStore()
    const { getStats, submissions } = useAssignmentStore()

    useEffect(() => {
        if (!user || user.role !== 'teacher') {
            router.push('/login')
        }
    }, [user, router])

    if (!user) return null

    const assignmentStats = getStats()
    const recentSubmissions = submissions
        .filter(s => s.status === 'submitted' || s.status === 'graded')
        .slice(0, 5)
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())

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

    const quickActions = [
        { label: 'Create Batch', icon: Users, color: 'bg-primary', href: '/teacher/batches/new' },
        { label: 'Upload Content', icon: Upload, color: 'bg-secondary', href: '/teacher/content/new' },
        { label: 'New Assignment', icon: ClipboardList, color: 'bg-accent', href: '/teacher/assignments/new' },
        { label: 'Schedule Class', icon: Calendar, color: 'bg-primary', href: '/teacher/classes' },
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
                    title="Active Assignments"
                    value={assignmentStats.active.toString()}
                    description={`${assignmentStats.total} total`}
                    icon={ClipboardList}
                    iconColor="text-secondary"
                />
                <StatCard
                    title="Pending Reviews"
                    value={assignmentStats.pendingReview.toString()}
                    description="Awaiting grading"
                    icon={Clock}
                    iconColor="text-orange-600"
                />
                <StatCard
                    title="Avg. Grade"
                    value={assignmentStats.averageGrade ? `${assignmentStats.averageGrade.toFixed(1)}%` : 'N/A'}
                    trend={assignmentStats.passingRate ? { value: assignmentStats.passingRate, isPositive: true } : undefined}
                    description={assignmentStats.passingRate ? `${assignmentStats.passingRate.toFixed(0)}% passing` : 'No data'}
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
                                <Link key={index} href={action.href}>
                                    <Button
                                        variant="outline"
                                        className="h-24 w-full flex-col gap-2"
                                    >
                                        <div className={`h-10 w-10 rounded-full ${action.color} flex items-center justify-center`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="text-sm font-medium">{action.label}</span>
                                    </Button>
                                </Link>
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
                            {assignmentStats.pendingReview > 0 && (
                                <Badge variant="destructive">{assignmentStats.pendingReview} pending</Badge>
                            )}
                        </div>
                        <CardDescription>Latest assignment submissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSubmissions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No submissions yet</p>
                            ) : (
                                recentSubmissions.map((submission) => (
                                    <div key={submission.id} className="flex items-start gap-3">
                                        <div className={`h-2 w-2 rounded-full mt-2 ${submission.status === 'submitted' ? 'bg-orange-500' : 'bg-green-500'}`} />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{submission.studentName}</p>
                                            <p className="text-xs text-muted-foreground">Assignment ID: {submission.assignmentId}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(submission.submittedAt, 'PPp')}
                                            </p>
                                        </div>
                                        {submission.status === 'submitted' ? (
                                            <Link href={`/teacher/assignments/${submission.assignmentId}/submissions/${submission.id}`}>
                                                <Button size="sm" variant="outline">
                                                    Grade
                                                </Button>
                                            </Link>
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <Link href="/teacher/assignments">
                            <Button variant="outline" className="w-full mt-4">
                                View All Assignments
                            </Button>
                        </Link>
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
