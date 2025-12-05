import { ClassSession } from '@/types/class'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users, Video, ExternalLink, MoreHorizontal } from 'lucide-react'
import { format, formatDistance } from 'date-fns'
import Link from 'next/link'

interface ClassCardProps {
    classSession: ClassSession
    variant?: 'default' | 'compact'
    role?: 'teacher' | 'student'
    onEdit?: (id: string) => void
    onCancel?: (id: string) => void
    onJoin?: (url: string) => void
}

export function ClassCard({
    classSession,
    variant = 'default',
    role = 'teacher',
    onEdit,
    onCancel,
    onJoin
}: ClassCardProps) {
    const getBatchColor = (batchId: string) => {
        const colors: { [key: string]: string } = {
            'batch-1': 'bg-blue-500',
            'batch-2': 'bg-purple-500',
            'batch-3': 'bg-green-500',
            'batch-4': 'bg-amber-500',
        }
        return colors[batchId] || 'bg-gray-500'
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'default'
            case 'ongoing':
                return 'secondary'
            case 'completed':
                return 'outline'
            case 'cancelled':
                return 'destructive'
            default:
                return 'default'
        }
    }

    const attendancePercentage = classSession.attendance.length > 0
        ? Math.round((classSession.attendance.filter(a => a.status === 'present').length / classSession.attendance.length) * 100)
        : 0

    const canJoinMeeting = () => {
        if (!classSession.meetingLink) return false
        const now = new Date()
        const classStart = new Date(classSession.startTime)
        const tenMinsBefore = new Date(classStart.getTime() - 10 * 60 * 1000)
        return now >= tenMinsBefore && classSession.status === 'scheduled'
    }

    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className={`w-1 h-12 rounded-full ${getBatchColor(classSession.batchId)}`} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm truncate">{classSession.title}</h4>
                        <Badge variant={getStatusBadgeVariant(classSession.status)} className="text-xs">
                            {classSession.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(classSession.startTime, 'h:mm a')}
                        </span>
                        <span>{classSession.duration} min</span>
                        <span className="truncate">{classSession.batchName}</span>
                    </div>
                </div>
                {classSession.meetingLink && canJoinMeeting() && (
                    <Button
                        size="sm"
                        onClick={() => onJoin?.(classSession.meetingLink!.url)}
                    >
                        <Video className="w-4 h-4 mr-1" />
                        Join
                    </Button>
                )}
            </div>
        )
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    {/* Color indicator */}
                    <div className={`w-1 h-full rounded-full ${getBatchColor(classSession.batchId)}`} />

                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg truncate">{classSession.title}</h3>
                                    <Badge variant={getStatusBadgeVariant(classSession.status)}>
                                        {classSession.status}
                                    </Badge>
                                    {classSession.isRecurring && (
                                        <Badge variant="outline" className="text-xs">
                                            Recurring
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{classSession.topic}</p>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{format(classSession.startTime, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{format(classSession.startTime, 'h:mm a')} ({classSession.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="truncate">{classSession.batchName}</span>
                            </div>
                            {classSession.status === 'completed' && classSession.attendance.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span>Attendance: {attendancePercentage}%</span>
                                </div>
                            )}
                        </div>

                        {/* Meeting Link */}
                        {classSession.meetingLink && (
                            <div className="flex items-center gap-2 p-2 bg-accent/50 rounded-md mb-3">
                                <Video className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground capitalize">
                                    {classSession.meetingLink.platform.replace('-', ' ')}
                                </span>
                                {canJoinMeeting() && (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="ml-auto"
                                        onClick={() => onJoin?.(classSession.meetingLink!.url)}
                                    >
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        Join Meeting
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {role === 'teacher' && (
                            <div className="flex gap-2">
                                <Link href={`/teacher/classes/${classSession.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        View Details
                                    </Button>
                                </Link>
                                {classSession.status === 'scheduled' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit?.(classSession.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onCancel?.(classSession.id)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        {role === 'student' && (
                            <Link href={`/student/schedule`}>
                                <Button variant="outline" size="sm" className="w-full">
                                    View Schedule
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
