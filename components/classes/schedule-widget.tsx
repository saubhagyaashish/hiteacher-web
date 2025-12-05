'use client'

import { ClassSession } from '@/types/class'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Video, ChevronRight } from 'lucide-react'
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns'
import Link from 'next/link'

interface ScheduleWidgetProps {
    classes: ClassSession[]
    role?: 'teacher' | 'student'
    title?: string
    limit?: number
}

export function ScheduleWidget({
    classes,
    role = 'teacher',
    title = 'Upcoming Classes',
    limit = 5
}: ScheduleWidgetProps) {
    // Filter for upcoming classes only
    const upcomingClasses = classes
        .filter(cls => isFuture(cls.startTime) && cls.status === 'scheduled')
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .slice(0, limit)

    if (upcomingClasses.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No upcoming classes scheduled
                    </p>
                </CardContent>
            </Card>
        )
    }

    const nextClass = upcomingClasses[0]
    const timeUntilNext = formatDistanceToNow(nextClass.startTime, { addSuffix: true })

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    Next class {timeUntilNext}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {upcomingClasses.map((cls) => (
                    <div
                        key={cls.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm truncate">{cls.title}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-2">
                                {cls.batchName}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(cls.startTime, 'MMM dd')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(cls.startTime, 'h:mm a')}
                                </span>
                                {cls.meetingLink && (
                                    <span className="flex items-center gap-1">
                                        <Video className="w-3 h-3" />
                                        {cls.meetingLink.platform.replace('-', ' ')}
                                    </span>
                                )}
                            </div>
                        </div>
                        {cls.meetingLink && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(cls.meetingLink!.url, '_blank')}
                            >
                                <Video className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                ))}

                <Link
                    href={role === 'teacher' ? '/teacher/classes' : '/student/schedule'}
                    className="block"
                >
                    <Button variant="outline" size="sm" className="w-full mt-2">
                        View All Classes
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
