'use client'

import { useState } from 'react'
import { AttendanceRecord, AttendanceStatus } from '@/types/class'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Check, X, Clock, AlertCircle, Search, Users } from 'lucide-react'

interface AttendanceMarkerProps {
    students: { id: string; name: string }[]
    attendance: AttendanceRecord[]
    onSave: (attendance: AttendanceRecord[]) => void
    classId: string
}

export function AttendanceMarker({ students, attendance, onSave, classId }: AttendanceMarkerProps) {
    const [localAttendance, setLocalAttendance] = useState<AttendanceRecord[]>(attendance)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

    // Filter students based on search
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Get attendance status for a student
    const getStudentStatus = (studentId: string): AttendanceStatus => {
        const record = localAttendance.find(a => a.studentId === studentId)
        return record?.status || 'absent'
    }

    // Update attendance for a student
    const updateAttendance = (studentId: string, status: AttendanceStatus) => {
        const studentName = students.find(s => s.id === studentId)?.name || ''
        const existingIndex = localAttendance.findIndex(a => a.studentId === studentId)

        if (existingIndex >= 0) {
            const updated = [...localAttendance]
            updated[existingIndex] = {
                ...updated[existingIndex],
                status,
                markedAt: new Date()
            }
            setLocalAttendance(updated)
        } else {
            setLocalAttendance([
                ...localAttendance,
                {
                    id: `attendance-${classId}-${studentId}`,
                    classId,
                    studentId,
                    studentName,
                    status,
                    markedAt: new Date()
                }
            ])
        }
    }

    // Bulk mark selected students
    const bulkMarkSelected = (status: AttendanceStatus) => {
        const updated = [...localAttendance]
        selectedStudents.forEach(studentId => {
            const studentName = students.find(s => s.id === studentId)?.name || ''
            const existingIndex = updated.findIndex(a => a.studentId === studentId)

            if (existingIndex >= 0) {
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    status,
                    markedAt: new Date()
                }
            } else {
                updated.push({
                    id: `attendance-${classId}-${studentId}`,
                    classId,
                    studentId,
                    studentName,
                    status,
                    markedAt: new Date()
                })
            }
        })
        setLocalAttendance(updated)
        setSelectedStudents(new Set())
    }

    // Mark all as present/absent
    const markAll = (status: AttendanceStatus) => {
        const updated = students.map(student => ({
            id: `attendance-${classId}-${student.id}`,
            classId,
            studentId: student.id,
            studentName: student.name,
            status,
            markedAt: new Date()
        }))
        setLocalAttendance(updated)
    }

    // Toggle student selection
    const toggleSelection = (studentId: string) => {
        const newSelected = new Set(selectedStudents)
        if (newSelected.has(studentId)) {
            newSelected.delete(studentId)
        } else {
            newSelected.add(studentId)
        }
        setSelectedStudents(newSelected)
    }

    // Calculate stats
    const stats = {
        total: students.length,
        present: localAttendance.filter(a => a.status === 'present').length,
        absent: students.length - localAttendance.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'excused').length,
        late: localAttendance.filter(a => a.status === 'late').length,
        excused: localAttendance.filter(a => a.status === 'excused').length,
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getStatusButton = (studentId: string, status: AttendanceStatus, icon: React.ReactNode, label: string, className: string) => {
        const isActive = getStudentStatus(studentId) === status
        return (
            <Button
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                className={isActive ? className : ''}
                onClick={() => updateAttendance(studentId, status)}
            >
                {icon}
                <span className="ml-1 hidden sm:inline">{label}</span>
            </Button>
        )
    }

    return (
        <div className="space-y-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Card>
                    <CardContent className="p-3 text-center">
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        <p className="text-xs text-muted-foreground">Present</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        <p className="text-xs text-muted-foreground">Absent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 text-center">
                        <p className="text-2xl font-bold text-amber-600">{stats.late}</p>
                        <p className="text-xs text-muted-foreground">Late</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3 text-center">
                        <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
                        <p className="text-xs text-muted-foreground">Excused</p>
                    </CardContent>
                </Card>
            </div>

            {/* Bulk Actions */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => markAll('present')}>
                            <Check className="w-4 h-4 mr-1" />
                            Mark All Present
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => markAll('absent')}>
                            <X className="w-4 h-4 mr-1" />
                            Mark All Absent
                        </Button>
                        {selectedStudents.size > 0 && (
                            <>
                                <div className="h-8 w-px bg-border" />
                                <Badge variant="secondary" className="h-8 px-3">
                                    {selectedStudents.size} selected
                                </Badge>
                                <Button size="sm" variant="outline" onClick={() => bulkMarkSelected('present')}>
                                    <Check className="w-4 h-4 mr-1" />
                                    Mark Selected Present
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => bulkMarkSelected('absent')}>
                                    <X className="w-4 h-4 mr-1" />
                                    Mark Selected Absent
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Student List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Students ({filteredStudents.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedStudents.has(student.id)}
                                onChange={() => toggleSelection(student.id)}
                                className="w-4 h-4"
                            />
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                    {getInitials(student.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{student.name}</p>
                            </div>
                            <div className="flex gap-1">
                                {getStatusButton(
                                    student.id,
                                    'present',
                                    <Check className="w-4 h-4" />,
                                    'Present',
                                    'bg-green-600 hover:bg-green-700'
                                )}
                                {getStatusButton(
                                    student.id,
                                    'late',
                                    <Clock className="w-4 h-4" />,
                                    'Late',
                                    'bg-amber-600 hover:bg-amber-700'
                                )}
                                {getStatusButton(
                                    student.id,
                                    'excused',
                                    <AlertCircle className="w-4 h-4" />,
                                    'Excused',
                                    'bg-blue-600 hover:bg-blue-700'
                                )}
                                {getStatusButton(
                                    student.id,
                                    'absent',
                                    <X className="w-4 h-4" />,
                                    'Absent',
                                    'bg-red-600 hover:bg-red-700'
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setLocalAttendance(attendance)}>
                    Reset
                </Button>
                <Button onClick={() => onSave(localAttendance)}>
                    <Check className="w-4 h-4 mr-2" />
                    Save Attendance
                </Button>
            </div>
        </div>
    )
}
