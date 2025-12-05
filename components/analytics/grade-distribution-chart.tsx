'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { ChartData } from '@/types/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface GradeDistributionChartProps {
    data: ChartData[]
    title?: string
    description?: string
}

export function GradeDistributionChart({
    data,
    title = 'Grade Distribution',
    description = 'Distribution of grades across all assignments'
}: GradeDistributionChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={(entry.fill as string) || '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Summary stats */}
                <div className="mt-4 grid grid-cols-5 gap-2 text-center">
                    {data.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div
                                className="w-4 h-4 rounded-full mx-auto"
                                style={{ backgroundColor: item.fill }}
                            />
                            <p className="text-xs font-medium">{item.name.split(' ')[0]}</p>
                            <p className="text-sm font-bold">{item.value}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
