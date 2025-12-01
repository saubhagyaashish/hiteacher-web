'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { batchSchema, type BatchFormData } from '@/lib/validations/batch'

const SUBJECTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'History', 'Geography', 'Computer Science',
    'Economics', 'Business Studies', 'Accountancy', 'Other'
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function NewBatchPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDays, setSelectedDays] = useState<string[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<BatchFormData>({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            maxStudents: 30,
            accessType: 'invite-only'
        }
    })

    const toggleDay = (day: string) => {
        const updated = selectedDays.includes(day)
            ? selectedDays.filter(d => d !== day)
            : [...selectedDays, day]
        setSelectedDays(updated)
        setValue('schedule.days', updated)
    }

    const onSubmit = async (data: BatchFormData) => {
        setIsLoading(true)

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        console.log('Creating batch:', data)
        setIsLoading(false)

        // Redirect to batch list
        router.push('/teacher/batches')
    }

    const subject = watch('subject')

    return (
        <DashboardLayout role="teacher" title="Create New Batch" subtitle="Set up a new batch for your students">
            <div className="max-w-3xl">
                <Link
                    href="/teacher/batches"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Batches
                </Link>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Essential details about your batch</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Batch Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Advanced Mathematics - Batch A"
                                    {...register('name')}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Subject *</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {SUBJECTS.map((subj) => (
                                        <button
                                            key={subj}
                                            type="button"
                                            onClick={() => setValue('subject', subj)}
                                            className={`p-2 text-sm rounded-md border transition-colors ${subject === subj
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-muted border-input'
                                                }`}
                                        >
                                            {subj}
                                        </button>
                                    ))}
                                </div>
                                <input type="hidden" {...register('subject')} />
                                {errors.subject && (
                                    <p className="text-sm text-destructive">{errors.subject.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    placeholder="Brief description about this batch..."
                                    {...register('description')}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule</CardTitle>
                            <CardDescription>When will classes be held?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Class Days *</Label>
                                <div className="grid grid-cols-7 gap-2">
                                    {DAYS.map((day) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`p-2 text-xs rounded-md border transition-colors ${selectedDays.includes(day)
                                                    ? 'bg-secondary text-secondary-foreground border-secondary'
                                                    : 'bg-background hover:bg-muted border-input'
                                                }`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                                {selectedDays.length > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Selected: {selectedDays.join(', ')}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Start Time *</Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        {...register('schedule.startTime')}
                                    />
                                    {errors.schedule?.startTime && (
                                        <p className="text-sm text-destructive">{errors.schedule.startTime.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime">End Time *</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        {...register('schedule.endTime')}
                                    />
                                    {errors.schedule?.endTime && (
                                        <p className="text-sm text-destructive">{errors.schedule.endTime.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Settings</CardTitle>
                            <CardDescription>Capacity and access control</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxStudents">Maximum Students</Label>
                                <Input
                                    id="maxStudents"
                                    type="number"
                                    min="1"
                                    max="100"
                                    {...register('maxStudents', { valueAsNumber: true })}
                                />
                                {errors.maxStudents && (
                                    <p className="text-sm text-destructive">{errors.maxStudents.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Access Type</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['public', 'private', 'invite-only'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setValue('accessType', type as any)}
                                            className={`p-3 text-sm rounded-md border transition-colors ${watch('accessType') === type
                                                    ? 'bg-accent text-accent-foreground border-accent'
                                                    : 'bg-background hover:bg-muted border-input'
                                                }`}
                                        >
                                            <div className="font-medium capitalize">{type.replace('-', ' ')}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {type === 'public' && 'Anyone can join'}
                                                {type === 'private' && 'Approval required'}
                                                {type === 'invite-only' && 'Invitation only'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Batch
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}
