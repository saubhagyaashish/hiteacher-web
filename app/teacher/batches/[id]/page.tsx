'use client'

import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft,
    Users,
    Calendar,
    TrendingUp,
    Plus,
    Mail,
    Settings,
    BookOpen
} from 'lucide-react'

// Mock batch data
const batch = {
    id: 1,
    name: 'Advanced Mathematics - Batch A',
    subject: 'Mathematics',
    description: 'Advanced calculus and algebra for grade 12 students preparing for competitive exams',
    students: 25,
    maxStudents: 30,
    schedule: 'Mon, Wed, Fri - 10:00 AM - 12:00 PM',
    performance: 87,
    attendance: 94,
    status: 'active',
    createdAt: '2024-09-01',
    accessType: 'invite-only'
}

const students = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', performance: 92, attendance: 98, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
    { id: 2, name: 'Bob Williams', email: 'bob@example.com', performance: 85, attendance: 95, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', performance: 88, attendance: 92, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
    { id: 4, name: 'David Miller', email: 'david@example.com', performance: 90, attendance: 96, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: 5, name: 'Emma Wilson', email: 'emma@example.com', performance: 83, attendance: 90, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
]

const upcomingClasses = [
    { date: 'Mon, Dec 2', time: '10:00 AM', topic: 'Differential Calculus' },
    { date: 'Wed, Dec 4', time: '10:00 AM', topic: 'Integration Methods' },
    { date: 'Fri, Dec 6', time: '10:00 AM', topic: 'Vector Algebra' },
]

export default function BatchDetailsPage() {
    return (
        <DashboardLayout role="teacher" title={batch.name} subtitle={batch.subject}>
            <Link
                href="/teacher/batches"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Batches
            </Link>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batch.students}/{batch.maxStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((batch.students / batch.maxStudents) * 100)}% capacity
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Performance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batch.performance}%</div>
                        <p className="text-xs text-muted-foreground">Average score</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batch.attendance}%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant="secondary" className="text-lg">Active</Badge>
                        <p className="text-xs text-muted-foreground mt-2">Since {batch.createdAt}</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="students" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                {/* Students Tab */}
                <TabsContent value="students" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Enrolled Students ({students.length})</h3>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Mail className="h-4 w-4 mr-2" />
                                Invite Students
                            </Button>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Student
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {students.map((student) => (
                                    <div key={student.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                                        <Avatar>
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback>{student.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-sm text-muted-foreground">{student.email}</p>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="text-center">
                                                <p className="font-medium">{student.performance}%</p>
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
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Classes Tab */}
                <TabsContent value="classes" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Upcoming Classes</h3>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Class
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {upcomingClasses.map((cls, index) => (
                            <Card key={index}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Calendar className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{cls.topic}</p>
                                            <p className="text-sm text-muted-foreground">{cls.date} at {cls.time}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline">Manage</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Batch Information</CardTitle>
                                <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Edit Batch
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Batch Name</p>
                                    <p className="font-medium">{batch.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Subject</p>
                                    <p className="font-medium">{batch.subject}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Schedule</p>
                                    <p className="font-medium">{batch.schedule}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Access Type</p>
                                    <Badge variant="outline" className="capitalize">{batch.accessType.replace('-', ' ')}</Badge>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                                    <p className="text-sm">{batch.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    )
}
