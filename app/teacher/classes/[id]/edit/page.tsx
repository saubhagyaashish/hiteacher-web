'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClassStore } from '@/store/class-store'
import { useBatchStore } from '@/store/batch-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { ClassForm } from '@/components/classes/class-form'
import { ClassSessionFormData } from '@/lib/validations/class'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

interface EditClassPageProps {
    params: Promise<{ id: string }>
}

export default function EditClassPage({ params }: EditClassPageProps) {
    const { id } = use(params)
    const router = useRouter()
    const { batches } = useBatchStore()
    const { getClassById, updateClassWithSeries } = useClassStore()
    const [isLoading, setIsLoading] = useState(false)
    const [updateSeries, setUpdateSeries] = useState(false)

    const classSession = getClassById(id)

    if (!classSession) {
        notFound()
    }

    const handleSubmit = async (data: ClassSessionFormData) => {
        setIsLoading(true)

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Build updates object
            const updates = {
                title: data.title,
                topic: data.topic,
                description: data.description,
                startTime: data.startTime,
                endTime: new Date(data.startTime.getTime() + data.duration * 60000),
                duration: data.duration,
                meetingLink: data.meetingLink,
                notes: data.notes,
            }

            // Update class (and series if applicable)
            updateClassWithSeries(id, updates, updateSeries)

            // Navigate back
            router.push(`/teacher/classes/${id}`)
        } catch (error) {
            console.error('Error updating class:', error)
            alert('Failed to update class. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Edit Class"
            subtitle="Update class details and schedule"
        >
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href={`/teacher/classes/${id}`}>
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Class Details
                    </Button>
                </Link>

                {/* Recurring Series Warning */}
                {classSession.isRecurring && classSession.recurringGroupId && (
                    <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                                        This is a recurring class
                                    </h3>
                                    <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                                        This class is part of a recurring series. You can choose to update only this
                                        class or all classes in the series.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="updateSeries"
                                            checked={updateSeries}
                                            onChange={(e) => setUpdateSeries(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                        <label
                                            htmlFor="updateSeries"
                                            className="text-sm font-medium text-orange-900 dark:text-orange-100 cursor-pointer"
                                        >
                                            Update all classes in this series
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Form */}
                <ClassForm
                    batches={batches}
                    defaultValues={{
                        batchId: classSession.batchId,
                        title: classSession.title,
                        topic: classSession.topic,
                        description: classSession.description,
                        startTime: classSession.startTime,
                        duration: classSession.duration,
                        meetingLink: classSession.meetingLink,
                        notes: classSession.notes,
                        isRecurring: classSession.isRecurring,
                        recurringPattern: classSession.recurringPattern,
                    }}
                    onSubmit={handleSubmit}
                    submitLabel="Update Class"
                    isLoading={isLoading}
                />
            </div>
        </DashboardLayout>
    )
}
