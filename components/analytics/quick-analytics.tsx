'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface QuickAnalyticsProps {
    averageGrade: number
    averageAttendance: number
    totalStudents: number
    studentsNeedingAttention: number
}

export function QuickAnalytics({
    averageGrade,
    averageAttendance,
    totalStudents,
    studentsNeedingAttention
}: QuickAnalyticsProps) {
    const gradeStatus = averageGrade >= 75 ? 'good' : averageGrade >= 60 ? 'warning' : 'alert'
    const attendanceStatus = averageAttendance >= 80 ? 'good' : averageAttendance >= 70 ? 'warning' : 'alert'

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Quick Analytics
                        </CardTitle>
                        <CardDescription>Performance overview this month</CardDescription>
                    </div>
                    <Link href="/teacher/analytics">
                        <Button variant="ghost" size="sm">
                            View All
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Average Grade */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Average Grade</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{averageGrade.toFixed(1)}%</span>
                            {gradeStatus === 'good' ? (
                                <Badge variant="secondary" className="gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Good
                                </Badge>
                            ) : gradeStatus === 'warning' ? (
                                <Badge variant="outline" className="gap-1">
                                    Needs Improvement
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="gap-1">
                                    <TrendingDown className="w-3 h-3" />
                                    Alert
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${gradeStatus === 'good'
                            ? 'bg-green-100 dark:bg-green-900'
                            : gradeStatus === 'warning'
                                ? 'bg-yellow-100 dark:bg-yellow-900'
                                : 'bg-red-100 dark:bg-red-900'
                        }`}>
                        <BarChart3 className={`w-6 h-6 ${gradeStatus === 'good'
                                ? 'text-green-600 dark:text-green-400'
                                : gradeStatus === 'warning'
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`} />
                    </div>
                </div>

                {/* Average Attendance */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Average Attendance</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{averageAttendance.toFixed(1)}%</span>
                            {attendanceStatus === 'good' ? (
                                <Badge variant="secondary" className="gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Good
                                </Badge>
                            ) : attendanceStatus === 'warning' ? (
                                <Badge variant="outline">
                                    Monitor
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="gap-1">
                                    <TrendingDown className="w-3 h-3" />
                                    Low
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {studentsNeedingAttention > 0 && (
                    <div className="pt-3 border-t">
                        <div className="flex items-center justify-between p-3 rounded-md bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                            <div>
                                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                                    {studentsNeedingAttention} student{studentsNeedingAttention !== 1 ? 's' : ''} need attention
                                </p>
                                <p className="text-xs text-orange-700 dark:text-orange-300">
                                    Low grades or attendance
                                </p>
                            </div>
                            <Link href="/teacher/analytics">
                                <Button size="sm" variant="outline">
                                    Review
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Students Summary */}
                <div className="pt-3 border-t text-sm text-muted-foreground">
                    <p>Tracking {totalStudents} students across all batches</p>
                </div>
            </CardContent>
        </Card>
    )
}
