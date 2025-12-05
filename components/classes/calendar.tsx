'use client'

import { useState } from 'react'
import { ClassSession, CalendarView } from '@/types/class'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    addMonths,
    subMonths,
    startOfDay,
    endOfDay
} from 'date-fns'

interface CalendarProps {
    classes: ClassSession[]
    onDateClick?: (date: Date) => void
    onClassClick?: (classSession: ClassSession) => void
}

export function Calendar({ classes, onDateClick, onClassClick }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const getClassesForDay = (date: Date): ClassSession[] => {
        const dayStart = startOfDay(date)
        const dayEnd = endOfDay(date)

        return classes.filter(cls => {
            const classDate = startOfDay(cls.startTime)
            return classDate.getTime() === dayStart.getTime()
        })
    }

    const getBatchColor = (batchId: string) => {
        const colors: { [key: string]: string } = {
            'batch-1': 'bg-blue-500',
            'batch-2': 'bg-purple-500',
            'batch-3': 'bg-green-500',
            'batch-4': 'bg-amber-500',
        }
        return colors[batchId] || 'bg-gray-500'
    }

    const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={previousMonth}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setCurrentMonth(new Date())}>
                            Today
                        </Button>
                        <Button size="sm" variant="outline" onClick={nextMonth}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                    {daysInCalendar.map((date, index) => {
                        const dayClasses = getClassesForDay(date)
                        const isCurrentMonth = isSameMonth(date, currentMonth)
                        const isCurrentDay = isToday(date)

                        return (
                            <div
                                key={index}
                                className={`
                                    min-h-24 p-2 rounded-lg border transition-colors
                                    ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                                    ${isCurrentDay ? 'border-primary border-2' : 'border-border'}
                                    ${onDateClick ? 'cursor-pointer hover:bg-accent/50' : ''}
                                `}
                                onClick={() => onDateClick?.(date)}
                            >
                                <div className={`
                                    text-sm font-medium mb-1
                                    ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                                    ${isCurrentDay ? 'text-primary font-bold' : ''}
                                `}>
                                    {format(date, 'd')}
                                </div>
                                <div className="space-y-1">
                                    {dayClasses.slice(0, 3).map(cls => (
                                        <button
                                            key={cls.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onClassClick?.(cls)
                                            }}
                                            className={`
                                                w-full text-left px-1.5 py-0.5 rounded text-xs
                                                text-white truncate hover:opacity-80 transition-opacity
                                                ${getBatchColor(cls.batchId)}
                                            `}
                                        >
                                            {format(cls.startTime, 'h:mm a')} - {cls.title}
                                        </button>
                                    ))}
                                    {dayClasses.length > 3 && (
                                        <div className="text-xs text-muted-foreground pl-1.5">
                                            +{dayClasses.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500" />
                        <span className="text-xs text-muted-foreground">Batch A (Math)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-purple-500" />
                        <span className="text-xs text-muted-foreground">Batch B (Physics)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-xs text-muted-foreground">Batch C (Chemistry)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500" />
                        <span className="text-xs text-muted-foreground">Batch D (Biology)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
