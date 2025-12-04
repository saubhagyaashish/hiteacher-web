import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp, Award } from 'lucide-react'

interface GradeDisplayProps {
    grade: number
    maxPoints: number
    passingScore?: number
    size?: 'sm' | 'md' | 'lg'
    showPercentage?: boolean
}

export function GradeDisplay({
    grade,
    maxPoints,
    passingScore,
    size = 'md',
    showPercentage = true,
}: GradeDisplayProps) {
    const percentage = (grade / maxPoints) * 100
    const isPassing = passingScore ? grade >= passingScore : percentage >= 60

    const getGradeColor = () => {
        if (percentage >= 90) return 'text-green-600 dark:text-green-400'
        if (percentage >= 75) return 'text-blue-600 dark:text-blue-400'
        if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-destructive'
    }

    const getGradeIcon = () => {
        if (percentage >= 90) return Trophy
        if (percentage >= 75) return Award
        return TrendingUp
    }

    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
    }

    const Icon = getGradeIcon()

    return (
        <div className="flex items-center gap-3">
            <div className={`font-bold ${getGradeColor()} ${sizeClasses[size]}`}>
                {grade}/{maxPoints}
            </div>
            {showPercentage && (
                <div className="flex items-center gap-2">
                    <Badge variant={isPassing ? 'secondary' : 'destructive'} className="text-sm">
                        {percentage.toFixed(1)}%
                    </Badge>
                    {percentage >= 75 && <Icon className="w-5 h-5 text-amber-500" />}
                </div>
            )}
        </div>
    )
}
