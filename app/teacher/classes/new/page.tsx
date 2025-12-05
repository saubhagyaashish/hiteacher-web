'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClassStore } from '@/store/class-store'
import { useBatchStore } from '@/store/batch-store'
import { useAuthStore } from '@/store/auth-store'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { ClassForm } from '@/components/classes/class-form'
import { ClassSessionFormData } from '@/lib/validations/class'
import { createClassFromFormData, generateRecurringClasses } from '@/lib/utils/class-utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewClassPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const { batches } = useBatchStore()
    const { createClass, createRecurringClasses } = useClassStore()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: ClassSessionFormData) => {
        if (!user) return

        setIsLoading(true)

        try {
            // Get batch name
            const batch = batches.find(b => b.id === data.batchId)
            if (!batch) {
                alert('Selected batch not found')
                setIsLoading(false)
                return
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (data.isRecurring && data.recurringPattern) {
                // Generate recurring classes
                const recurringClasses = generateRecurringClasses(
                    data,
                    user.id,
                    user.name,
                    batch.name
                )

                if (recurringClasses.length === 0) {
                    alert('No classes generated. Please check your recurring pattern settings.')
                    setIsLoading(false)
                    return
                }

                createRecurringClasses(recurringClasses)
            } else {
                // Create single class
                const newClass = createClassFromFormData(
                    data,
                    user.id,
                    user.name,
                    batch.name
                )
                createClass(newClass)
            }

            // Navigate back to classes list
            router.push('/teacher/classes')
        } catch (error) {
            console.error('Error creating class:', error)
            alert('Failed to create class. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Create New Class"
            subtitle="Schedule a new class session for your students"
        >
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href="/teacher/classes">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Classes
                    </Button>
                </Link>

                {/* Form */}
                <ClassForm
                    batches={batches}
                    onSubmit={handleSubmit}
                    submitLabel="Create Class"
                    isLoading={isLoading}
                />
            </div>
        </DashboardLayout>
    )
}
