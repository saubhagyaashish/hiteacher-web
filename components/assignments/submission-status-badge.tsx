import { Badge } from '@/components/ui/badge'
import { SubmissionStatus } from '@/types/assignment'
import { Clock, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react'

interface SubmissionStatusBadgeProps {
    status: SubmissionStatus
    isLate?: boolean
}

export function SubmissionStatusBadge({ status, isLate }: SubmissionStatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    variant: 'outline' as const,
                    label: 'Not Submitted',
                    icon: Clock,
                    className: 'text-muted-foreground',
                }
            case 'submitted':
                return {
                    variant: 'secondary' as const,
                    label: isLate ? 'Late Submission' : 'Submitted',
                    icon: FileCheck,
                    className: isLate ? 'bg-orange-500/10 text-orange-600' : '',
                }
            case 'graded':
                return {
                    variant: 'default' as const,
                    label: 'Graded',
                    icon: CheckCircle2,
                    className: 'bg-green-500/10 text-green-600',
                }
            case 'late':
                return {
                    variant: 'destructive' as const,
                    label: 'Overdue',
                    icon: AlertCircle,
                    className: '',
                }
        }
    }

    const { variant, label, icon: Icon, className } = getStatusConfig()

    return (
        <Badge variant={variant} className={className}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
        </Badge>
    )
}
