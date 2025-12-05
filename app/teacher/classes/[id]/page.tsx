'use client'

import { use } from 'react'
import { useClassStore } from '@/store/class-store'
import { useBatchStore } from '@/store/batch-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MeetingLink } from '@/components/classes/meeting-link'
import { AttendanceMarker } from '@/components/classes/attendance-marker'
import {
    Calendar,
    Clock,
    Users,
    Video,
    Edit,
    Trash2,
    ArrowLeft,
    FileText,
    CheckCircle2
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'

export default function ClassDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const { getClassById, deleteClass, markAttendance, updateClass } = useClassStore()
    const { getBatchById } = useBatchStore()

    const classSession = getClassById(id)

    if (!classSession) {
        notFound()
    }

    const batch = getBatchById(classSession.batchId)
    const students = batch?.students || []

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            deleteClass(id)
            router.push('/teacher/classes')
        }
    }

    const handleStartClass = () => {
        updateClass(id, { status: 'ongoing' })
    }

    const handleEndClass = () => {
        updateClass(id, { status: 'completed' })
    }

    const handleSaveAttendance = (attendance: any[]) => {
        markAttendance(id, attendance)
        alert('Attendance saved successfully!')
    }

    return (
        <DashboardLayout
            role="teacher"
            title={classSession.title}
            subtitle={classSession.topic}
        >
            <div className="mb-4">
                <Link href="/teacher/classes">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Classes
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="attendance">Attendance</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Class Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Topic</h4>
                                        <p className="font-medium">{classSession.topic}</p>
                                    </div>

                                    {classSession.description && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                                            <p className="text-sm">{classSession.description}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
                                            <p className="text-sm">{format(classSession.startTime, 'MMMM dd, yyyy')}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Time</h4>
                                            <p className="text-sm">
                                                {format(classSession.startTime, 'h:mm a')} - {format(classSession.endTime, 'h:mm a')}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                                            <p className="text-sm">{classSession.duration} minutes</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Batch</h4>
                                            <p className="text-sm">{classSession.batchName}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meeting Link */}
                            {classSession.meetingLink && (
                                <MeetingLink
                                    meetingLink={classSession.meetingLink}
                                    startTime={classSession.startTime}
                                />
                            )}

                            {/* Topics Covered (for completed classes) */}
                            {classSession.status === 'completed' && classSession.topicsCovered && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Topics Covered</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside space-y-1">
                                            {classSession.topicsCovered.map((topic, index) => (
                                                <li key={index} className="text-sm">{topic}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Homework */}
                            {classSession.homeworkAssigned && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Homework Assigned</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{classSession.homeworkAssigned}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Attendance Tab */}
                        <TabsContent value="attendance">
                            <AttendanceMarker
                                students={students.map(s => ({ id: s.id, name: s.name }))}
                                attendance={classSession.attendance}
                                onSave={handleSaveAttendance}
                                classId={id}
                            />
                        </TabsContent>

                        {/* Notes Tab */}
                        <TabsContent value="notes">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Class Notes</CardTitle>
                                    <CardDescription>
                                        Add notes about this class session
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <textarea
                                        className="w-full min-h-[200px] p-3 border rounded-md"
                                        placeholder="Enter class notes, observations, or important points..."
                                        defaultValue={classSession.notes || ''}
                                        onBlur={(e) => updateClass(id, { notes: e.target.value })}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status and Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Badge
                                variant={
                                    classSession.status === 'completed' ? 'outline' :
                                        classSession.status === 'ongoing' ? 'secondary' :
                                            classSession.status === 'cancelled' ? 'destructive' :
                                                'default'
                                }
                                className="w-full justify-center py-2"
                            >
                                {classSession.status.toUpperCase()}
                            </Badge>

                            {classSession.status === 'scheduled' && (
                                <>
                                    <Button className="w-full" onClick={handleStartClass}>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Start Class
                                    </Button>
                                    <Link href={`/teacher/classes/${id}/edit`} className="block">
                                        <Button variant="outline" className="w-full">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Class
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {classSession.status === 'ongoing' && (
                                <Button className="w-full" onClick={handleEndClass}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    End Class
                                </Button>
                            )}

                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleDelete}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Class
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{students.length} students enrolled</span>
                            </div>
                            {classSession.attendance.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                                    <span>
                                        {classSession.attendance.filter(a => a.status === 'present').length} attended
                                    </span>
                                </div>
                            )}
                            {classSession.isRecurring && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span>Recurring class</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
