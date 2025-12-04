'use client'

import { useEffect, useState } from 'react'
import { Clock, Calendar } from 'lucide-react'
import { formatDistanceToNow, isPast, differenceInHours } from 'date-fns'

interface DueDateCountdownProps {
    dueDate: Date
    showIcon?: boolean
}

export function DueDateCountdown({ dueDate, showIcon = true }: DueDateCountdownProps) {
    const [timeLeft, setTimeLeft] = useState('')
    const [colorClass, setColorClass] = useState('')

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date()
            const due = new Date(dueDate)
            const hoursLeft = differenceInHours(due, now)

            if (isPast(due)) {
                setTimeLeft(`Overdue by ${formatDistanceToNow(due)}`)
                setColorClass('text-destructive')
            } else {
                setTimeLeft(`Due in ${formatDistanceToNow(due)}`)

                if (hoursLeft < 24) {
                    setColorClass('text-orange-600 dark:text-orange-400')
                } else if (hoursLeft < 72) {
                    setColorClass('text-yellow-600 dark:text-yellow-400')
                } else {
                    setColorClass('text-muted-foreground')
                }
            }
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [dueDate])

    return (
        <div className={`flex items-center gap-2 text-sm font-medium ${colorClass}`}>
            {showIcon && (isPast(new Date(dueDate)) ?
                <Clock className="w-4 h-4" /> :
                <Calendar className="w-4 h-4" />
            )}
            <span>{timeLeft}</span>
        </div>
    )
}
