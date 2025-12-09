'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Users,
    ShieldCheck,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    BookOpen,
    DollarSign
} from 'lucide-react'

export default function AdminDashboard() {
    const router = useRouter()
    const { user } = useAuthStore()

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/login')
        }
    }, [user, router])

    if (!user) return null

    const pendingApprovals = [
        {
            id: 1,
            name: 'Dr. Michael Chen',
            type: 'Teacher',
            subject: 'Physics',
            date: '2 hours ago',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
        },
        {
            id: 2,
            name: 'Emma Thompson',
            type: 'Teacher',
            subject: 'Mathematics',
            date: '5 hours ago',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
        },
        {
            id: 3,
            name: 'James Wilson',
            type: 'Student',
            subject: 'Batch Access',
            date: '1 day ago',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
        },
    ]

    const recentActivity = [
        { action: 'New student enrollment', user: 'Alice Johnson', time: '10 minutes ago' },
        { action: 'Content uploaded', user: 'John Doe (Teacher)', time: '1 hour ago' },
        { action: 'Teacher verified', user: 'Sarah Smith', time: '3 hours ago' },
        { action: 'Batch created', user: 'John Doe (Teacher)', time: '5 hours ago' },
    ]

    return (
        <DashboardLayout role="admin" title="Admin Dashboard" subtitle="Platform Overview & Management">
            {/* Stats Grid - Mobile First: 1 col → 2 cols → 4 cols */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
                <StatCard
                    title="Total Users"
                    value="2,543"
                    description="1,245 students, 45 teachers"
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Pending Approvals"
                    value="12"
                    description="8 teachers, 4 access requests"
                    icon={ShieldCheck}
                    iconColor="text-secondary"
                />
                <StatCard
                    title="Platform Growth"
                    value="+15%"
                    description="This month"
                    icon={TrendingUp}
                    trend={{ value: 15, isPositive: true }}
                    iconColor="text-accent"
                />
                <StatCard
                    title="Active Batches"
                    value="127"
                    description="Across all subjects"
                    icon={BookOpen}
                    iconColor="text-primary"
                />
            </div>

            {/* Widgets Grid - Mobile: stack, Tablet+: 2 cols */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mb-6 md:gap-6 md:mb-8">
                {/* Pending Approvals */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Pending Approvals</CardTitle>
                            <Badge variant="destructive">{pendingApprovals.length}</Badge>
                        </div>
                        <CardDescription>Review teacher applications and student access requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingApprovals.map((approval) => (
                                <div key={approval.id} className="flex items-center gap-4 p-3 rounded-lg border hover:border-primary/40 transition-colors">
                                    <Avatar>
                                        <AvatarImage src={approval.avatar} />
                                        <AvatarFallback>{approval.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{approval.name}</p>
                                        <p className="text-sm text-muted-foreground">{approval.subject}</p>
                                        <p className="text-xs text-muted-foreground">{approval.date}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="default">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Approve
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            View All Approvals
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest platform events and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                            View Activity Log
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* System Stats */}
            <Card>
                <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg">System Statistics</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Platform performance and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Daily Active Users</p>
                            <p className="text-2xl font-bold">1,234</p>
                            <p className="text-xs text-secondary">+8% from yesterday</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Content Uploads</p>
                            <p className="text-2xl font-bold">342</p>
                            <p className="text-xs text-secondary">This week</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Classes Held</p>
                            <p className="text-2xl font-bold">156</p>
                            <p className="text-xs text-secondary">This week</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Avg Session Time</p>
                            <p className="text-2xl font-bold">24m</p>
                            <p className="text-xs text-secondary">Per user</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
