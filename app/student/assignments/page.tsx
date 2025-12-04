'use client'

import { useMemo, useState } from 'react'
import { useAssignmentStore } from '@/store/assignment-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssignmentStatusBadge } from '@/components/assignments/assignment-status-badge'
import { DueDateCountdown } from '@/components/assignments/due-date-countdown'
import { GradeDisplay } from '@/components/assignments/grade-display'
import { Clock, CheckCircle2, AlertTriangle, FileText, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { format, isPast } from 'date-fns'

// Mock student ID - in production this would come from auth
const CURRENT_STUDENT_ID = 'student-1'

export default function StudentAssignmentsPage() {
    const { assignments, getSubmissionsByStudent } = useAssignmentStore()
    const [activeTab, setActiveTab] = useState('upcoming')

    const mySubmissions = useMemo(() => getSubmissionsByStudent(CURRENT_STUDENT_ID), [getSubmissionsByStudent])

    // Get assignments assigned to student's batches (simplified - in production would check actual enrollment)
    const allAssignments = assignments.filter(a => a.status === 'active')

    // Categorize assignments
    const assignmentsWithStatus = allAssignments.map(assignment => {
        const mySubmission = mySubmissions.find(s => s.assignmentId === assignment.id)
        const isOverdue = isPast(assignment.dueDate) && !mySubmission

        return {
            ...assignment,
            mySubmission,
            isOverdue,
            canSubmit: assignment.status === 'active' && (assignment.allowLateSubmission || !isPast(assignment.dueDate))
        }
    })

    const upcomingAssignments = assignmentsWithStatus.filter(a => !a.mySubmission && !a.isOverdue)
    const overdueAssignments = assignmentsWithStatus.filter(a => a.isOverdue)
    const submittedAssignments = assignmentsWithStatus.filter(a => a.mySubmission && a.mySubmission.status === 'submitted')
    const gradedAssignments = assignmentsWithStatus.filter(a => a.mySubmission && a.mySubmission.status === 'graded')

    const AssignmentCard = ({ assignment }: { assignment: typeof assignmentsWithStatus[0] }) => (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <Link href={`/student/assignments/${assignment.id}`}>
                            <CardTitle className="hover:text-primary cursor-pointer line-clamp-2">
                                {assignment.title}
                            </CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-2 mt-2">
                            {assignment.description}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize flex-shrink-0">
                        {assignment.type}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <DueDateCountdown dueDate={assignment.dueDate} />

                {assignment.mySubmission ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={assignment.mySubmission.status === 'graded' ? 'secondary' : 'outline'}>
                                {assignment.mySubmission.status === 'graded' ? 'Graded' : 'Submitted'}
                            </Badge>
                        </div>

                        {assignment.mySubmission.grade !== undefined && (
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Your Grade</p>
                                <GradeDisplay
                                    grade={assignment.mySubmission.grade}
                                    maxPoints={assignment.maxPoints}
                                    passingScore={assignment.passingScore}
                                    size="sm"
                                />
                            </div>
                        )}

                        {assignment.mySubmission.feedback && (
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm font-medium mb-1">Feedback</p>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {assignment.mySubmission.feedback}
                                </p>
                            </div>
                        )}

                        <Link href={`/student/assignments/${assignment.id}`}>
                            <Button variant="outline" size="sm" className="w-full">
                                View Details
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Link href={`/student/assignments/${assignment.id}`}>
                        <Button className="w-full" variant={assignment.isOverdue ? 'destructive' : 'default'}>
                            {assignment.isOverdue ? 'Submit (Late)' : 'Start Assignment'}
                        </Button>
                    </Link>
                )}
            </CardContent>
        </Card>
    )

    return (
        <DashboardLayout
            role="student"
            title="My Assignments"
            subtitle="View and submit your assignments"
        >
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{upcomingAssignments.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{overdueAssignments.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{submittedAssignments.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Graded</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{gradedAssignments.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Assignments Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="upcoming">
                        Upcoming
                        {upcomingAssignments.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {upcomingAssignments.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="overdue">
                        Overdue
                        {overdueAssignments.length > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {overdueAssignments.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="submitted">Submitted</TabsTrigger>
                    <TabsTrigger value="graded">Graded</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6">
                    {upcomingAssignments.length === 0 ? (
                        <Card className="p-12 text-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                            <p className="text-muted-foreground">No upcoming assignments</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingAssignments.map(assignment => (
                                <AssignmentCard key={assignment.id} assignment={assignment} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="overdue" className="mt-6">
                    {overdueAssignments.length === 0 ? (
                        <Card className="p-12 text-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Great job!</h3>
                            <p className="text-muted-foreground">No overdue assignments</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {overdueAssignments.map(assignment => (
                                <AssignmentCard key={assignment.id} assignment={assignment} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="submitted" className="mt-6">
                    {submittedAssignments.length === 0 ? (
                        <Card className="p-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No submitted assignments</h3>
                            <p className="text-muted-foreground">Assignments waiting for grading will appear here</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {submittedAssignments.map(assignment => (
                                <AssignmentCard key={assignment.id} assignment={assignment} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="graded" className="mt-6">
                    {gradedAssignments.length === 0 ? (
                        <Card className="p-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No graded assignments yet</h3>
                            <p className="text-muted-foreground">Graded assignments will appear here</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {gradedAssignments.map(assignment => (
                                <AssignmentCard key={assignment.id} assignment={assignment} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    )
}
