'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClassSessionFormData, classSessionSchema } from '@/lib/validations/class'
import { Batch } from '@/types/batch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Link2, Repeat, Video } from 'lucide-react'
import { useState } from 'react'

interface ClassFormProps {
    batches: Batch[]
    defaultValues?: Partial<ClassSessionFormData>
    onSubmit: (data: ClassSessionFormData) => void | Promise<void>
    submitLabel?: string
    isLoading?: boolean
}

const DAYS_OF_WEEK = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
]

const PLATFORM_OPTIONS = [
    { value: 'zoom', label: 'Zoom' },
    { value: 'google-meet', label: 'Google Meet' },
    { value: 'ms-teams', label: 'Microsoft Teams' },
    { value: 'other', label: 'Other' },
] as const

export function ClassForm({
    batches,
    defaultValues,
    onSubmit,
    submitLabel = 'Create Class',
    isLoading = false
}: ClassFormProps) {
    const [showMeetingLink, setShowMeetingLink] = useState(!!defaultValues?.meetingLink)
    const [isRecurring, setIsRecurring] = useState(defaultValues?.isRecurring || false)
    const [recurringType, setRecurringType] = useState<'none' | 'daily' | 'weekly' | 'custom'>(
        defaultValues?.recurringPattern?.type || 'none'
    )
    const [selectedDays, setSelectedDays] = useState<number[]>(
        defaultValues?.recurringPattern?.daysOfWeek || []
    )
    const [endType, setEndType] = useState<'date' | 'occurrences'>(
        defaultValues?.recurringPattern?.endDate ? 'date' : 'occurrences'
    )

    const form = useForm<ClassSessionFormData>({
        resolver: zodResolver(classSessionSchema) as any, // Type assertion needed due to Zod coercion
        defaultValues: {
            duration: 60,
            isRecurring: false,
            ...defaultValues,
        },
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = form

    const watchedIsRecurring = watch('isRecurring')

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    return (
        <form onSubmit={form.handleSubmit((data) => {
            const formData = data as unknown as ClassSessionFormData

            // Build recurring pattern if applicable
            if (formData.isRecurring && recurringType !== 'none') {
                formData.recurringPattern = {
                    type: recurringType,
                    interval: 1,
                    daysOfWeek: recurringType === 'weekly' ? selectedDays : undefined,
                    endDate: endType === 'date' ? formData.recurringPattern?.endDate : undefined,
                    occurrences: endType === 'occurrences' ? formData.recurringPattern?.occurrences : undefined,
                }
            }

            // Build meeting link if provided
            if (showMeetingLink && formData.meetingLink) {
                // Meeting link is already in the form data
            } else {
                formData.meetingLink = undefined
            }

            onSubmit(formData)
        })} className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Class Information
                    </CardTitle>
                    <CardDescription>Enter the basic details for the class</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Batch Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="batchId">Batch *</Label>
                        <select
                            id="batchId"
                            {...register('batchId')}
                            className="w-full h-11 px-3 py-2 border rounded-md bg-background"
                        >
                            <option value="">Select a batch</option>
                            {batches.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name} - {batch.subject}
                                </option>
                            ))}
                        </select>
                        {errors.batchId && (
                            <p className="text-sm text-red-600">{errors.batchId.message}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Class Title *</Label>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="e.g., Calculus - Derivatives"
                            className="h-11"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Topic */}
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic *</Label>
                        <Input
                            id="topic"
                            {...register('topic')}
                            placeholder="e.g., Introduction to Derivatives"
                            className="h-11"
                        />
                        {errors.topic && (
                            <p className="text-sm text-red-600">{errors.topic.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Additional details about the class..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {/* Start Date/Time */}
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Date & Time *</Label>
                            <Input
                                id="startTime"
                                type="datetime-local"
                                className="h-11"
                                {...register('startTime')}
                            />
                            {errors.startTime && (
                                <p className="text-sm text-red-600">{errors.startTime.message}</p>
                            )}
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes) *</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="15"
                                max="480"
                                step="15"
                                className="h-11"
                                {...register('duration', { valueAsNumber: true })}
                            />
                            {errors.duration && (
                                <p className="text-sm text-red-600">{errors.duration.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                        <input
                            type="checkbox"
                            id="isRecurring"
                            {...register('isRecurring')}
                            onChange={(e) => {
                                setValue('isRecurring', e.target.checked)
                                setIsRecurring(e.target.checked)
                            }}
                            className="w-4 h-4"
                        />
                        <Label htmlFor="isRecurring" className="cursor-pointer flex items-center gap-2">
                            <Repeat className="w-4 h-4" />
                            Recurring Class
                        </Label>
                    </div>

                    {/* Recurring Pattern */}
                    {isRecurring && (
                        <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                            <div className="space-y-2">
                                <Label>Recurrence Pattern</Label>
                                <select
                                    value={recurringType}
                                    onChange={(e) => setRecurringType(e.target.value as any)}
                                    className="w-full h-11 px-3 py-2 border rounded-md bg-background"
                                >
                                    <option value="none">Select pattern</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>

                            {/* Weekly Days Selection */}
                            {recurringType === 'weekly' && (
                                <div className="space-y-2">
                                    <Label>Repeat On</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() => toggleDay(day.value)}
                                                className={`px-3 py-1 text-sm rounded-md border transition-colors ${selectedDays.includes(day.value)
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-muted'
                                                    }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                    {isRecurring && recurringType === 'weekly' && selectedDays.length === 0 && (
                                        <p className="text-sm text-red-600">Please select at least one day</p>
                                    )}
                                </div>
                            )}

                            {/* End Condition */}
                            {recurringType !== 'none' && (
                                <div className="space-y-3">
                                    <Label>End Condition</Label>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                id="endOccurrences"
                                                checked={endType === 'occurrences'}
                                                onChange={() => setEndType('occurrences')}
                                                className="w-4 h-4"
                                            />
                                            <Label htmlFor="endOccurrences" className="cursor-pointer">
                                                After
                                            </Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="365"
                                                defaultValue={10}
                                                {...register('recurringPattern.occurrences', { valueAsNumber: true })}
                                                disabled={endType !== 'occurrences'}
                                                className="w-20"
                                            />
                                            <span className="text-sm text-muted-foreground">occurrences</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                id="endDate"
                                                checked={endType === 'date'}
                                                onChange={() => setEndType('date')}
                                                className="w-4 h-4"
                                            />
                                            <Label htmlFor="endDate" className="cursor-pointer">
                                                On
                                            </Label>
                                            <Input
                                                type="date"
                                                {...register('recurringPattern.endDate')}
                                                disabled={endType !== 'date'}
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Meeting Link */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Link2 className="w-5 h-5" />
                        Meeting Link
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="showMeetingLink"
                            checked={showMeetingLink}
                            onChange={(e) => setShowMeetingLink(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <Label htmlFor="showMeetingLink" className="cursor-pointer">
                            Add online meeting link
                        </Label>
                    </div>

                    {showMeetingLink && (
                        <div className="space-y-4">
                            {/* Platform */}
                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <select
                                    id="platform"
                                    {...register('meetingLink.platform')}
                                    className="w-full h-11 px-3 py-2 border rounded-md bg-background"
                                >
                                    {PLATFORM_OPTIONS.map((platform) => (
                                        <option key={platform.value} value={platform.value}>
                                            {platform.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* URL */}
                            <div className="space-y-2">
                                <Label htmlFor="meetingUrl">Meeting URL *</Label>
                                <Input
                                    id="meetingUrl"
                                    type="url"
                                    className="h-11"
                                    {...register('meetingLink.url')}
                                    placeholder="https://zoom.us/j/123456789"
                                />
                                {errors.meetingLink?.url && (
                                    <p className="text-sm text-red-600">{errors.meetingLink.url.message}</p>
                                )}
                            </div>

                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                {/* Meeting ID */}
                                <div className="space-y-2">
                                    <Label htmlFor="meetingId">Meeting ID (optional)</Label>
                                    <Input
                                        id="meetingId"
                                        className="h-11"
                                        {...register('meetingLink.meetingId')}
                                        placeholder="123 456 7890"
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password (optional)</Label>
                                    <Input
                                        id="password"
                                        type="text"
                                        className="h-11"
                                        {...register('meetingLink.password')}
                                        placeholder="****"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        {...register('notes')}
                        placeholder="Any additional notes or instructions..."
                        rows={3}
                    />
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={isLoading}
                    className="w-full sm:w-auto h-11"
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-11">
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    )
}
