import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    iconColor?: string
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    iconColor = 'text-primary'
}: StatCardProps) {
    return (
        <Card className="
            hover:shadow-lg transition-all border-l-4 border-l-primary
            cursor-pointer active:scale-[0.98]
        ">
            <CardHeader className="
                flex flex-row items-center justify-between space-y-0
                pb-2
                p-4 md:p-6
            ">
                <CardTitle className="
                    text-sm font-medium
                    md:text-base
                ">{title}</CardTitle>
                <div className="
                    h-10 w-10 rounded-full bg-primary/10
                    flex items-center justify-center shrink-0
                    md:h-12 md:w-12
                ">
                    <Icon className={cn("h-5 w-5 md:h-6 md:w-6", iconColor)} />
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="
                    text-2xl font-bold text-primary
                    md:text-3xl
                ">{value}</div>
                {description && (
                    <p className="
                        text-xs text-muted-foreground mt-1
                        md:text-sm
                    ">
                        {description}
                    </p>
                )}
                {trend && (
                    <p className={cn(
                        "text-xs font-medium mt-1 flex items-center gap-1",
                        trend.isPositive ? "text-secondary" : "text-destructive"
                    )}>
                        <span className="text-base">{trend.isPositive ? '↑' : '↓'}</span>
                        {Math.abs(trend.value)}% from last month
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
