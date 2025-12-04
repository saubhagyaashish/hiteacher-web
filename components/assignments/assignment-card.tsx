'use client'

import { Assignment } from '@/types/assignment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AssignmentStatusBadge } from './assignment-status-badge'
import { DueDateCountdown } from './due-date-countdown'
import { Edit2, Trash2, Copy, Eye, Users, FileText, Link as LinkIcon, Video, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useAssignmentStore } from '@/store/assignment-store'

interface AssignmentCardProps {
    assignment: Assignment
    viewMode?: 'grid' | 'list'
    onDelete?: (id: string) => void
    onDuplicate?: (id: string) => void
}

export function AssignmentCard({ assignment, viewMode = 'grid', onDelete, onDuplicate }: AssignmentCardProps) {
    const { getAssignmentStats } = useAssignmentStore()
    const stats = getAssignmentStats(assignment.id)

    const getTypeIcon = () => {
        switch (assignment.type) {
            case 'text': return FileText
            case 'file': return FileText
            case 'link': return LinkIcon
            case 'quiz': return ClipboardList
        }
    }

    const TypeIcon = getTypeIcon()

    const submissionProgress = stats.total > 0
        ? ((stats.submitted / stats.total) * 100).toFixed(0)
        : 0

    if (viewMode === 'list') {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <TypeIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                <Link href={`/teacher/assignments/${assignment.id}`}>
                                    <h3 className="font-semibold text-lg hover:text-primary truncate">
                                        {assignment.title}
                                    </h3>
                                </Link>
                                <AssignmentStatusBadge status={assignment.status} />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {assignment.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <DueDateCountdown dueDate={assignment.dueDate} />
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>{assignment.batchIds.length} batch{assignment.batchIds.length > 1 ? 'es' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Submissions:</span>
                                    <Badge variant="secondary">{stats.submitted}/{stats.total}</Badge>
                                </div>
                                {stats.pending > 0 && (
                                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600">
                                        {stats.pending} pending review
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link href={`/teacher/assignments/${assignment.id}`}>
                                <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                </Button>
                            </Link>
                            <Link href={`/teacher/assignments/${assignment.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                            </Link>
                            {onDuplicate && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDuplicate(assignment.id)}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(assignment.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <TypeIcon className="w-5 h-5 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                            {assignment.type}
                        </Badge>
                    </div>
                    <AssignmentStatusBadge status={assignment.status} />
                </div>
                <Link href={`/teacher/assignments/${assignment.id}`}>
                    <CardTitle className="hover:text-primary line-clamp-2 cursor-pointer">
                        {assignment.title}
                    </CardTitle>
                </Link>
                <CardDescription className="line-clamp-2">
                    {assignment.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-4">
                    <DueDateCountdown dueDate={assignment.dueDate} />

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{submissionProgress}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all"
                            style={{ width: `${submissionProgress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{assignment.batchIds.length} batch{assignment.batchIds.length > 1 ? 'es' : ''}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">Submissions</span>
                            <span className="font-semibold">{stats.submitted}/{stats.total}</span>
                        </div>
                    </div>

                    {stats.pending > 0 && (
                        <Badge variant="outline" className="w-full justify-center bg-orange-500/10 text-orange-600">
                            {stats.pending} pending review
                        </Badge>
                    )}
                </div>

                <div className="flex gap-2">
                    <Link href={`/teacher/assignments/${assignment.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                        </Button>
                    </Link>
                    <Link href={`/teacher/assignments/${assignment.id}/edit`}>
                        <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
