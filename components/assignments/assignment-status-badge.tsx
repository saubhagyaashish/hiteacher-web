import { Badge } from '@/components/ui/badge'
import { AssignmentStatus } from '@/types/assignment'

interface AssignmentStatusBadgeProps {
    status: AssignmentStatus
}

export function AssignmentStatusBadge({ status }: AssignmentStatusBadgeProps) {
    const variants = {
        active: { variant: 'secondary' as const, label: 'Active' },
        closed: { variant: 'outline' as const, label: 'Closed' },
        draft: { variant: 'default' as const, label: 'Draft' },
    }

    const { variant, label } = variants[status]

    return <Badge variant={variant}>{label}</Badge>
}
