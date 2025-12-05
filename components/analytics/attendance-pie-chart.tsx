'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { ChartData } from '@/types/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AttendancePieChartProps {
    data: ChartData[]
    title?: string
    description?: string
}

export function AttendancePieChart({
    data,
    title = 'Attendance Breakdown',
    description = 'Distribution of attendance statuses'
}: AttendancePieChartProps) {
    // Custom label to show percentage
    const renderCustomizedLabel = (entry: any) => {
        return `${entry.percentage}%`
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={(entry.fill as string) || '#3b82f6'} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>

                {/* Summary table */}
                <div className="mt-4 space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.fill as string }}
                                />
                                <span>{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-medium">{item.value}</span>
                                <span className="text-muted-foreground">({item.percentage}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
