'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSubjectStore } from '@/store/subject-store'
import { subjectSchema, type SubjectFormData } from '@/lib/validations/subject'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

const ICON_OPTIONS = ['📐', '🔬', '💻', '📚', '🎨', '🎵', '⚽', '🌍', '🧪', '📊']
const COLOR_OPTIONS = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#EC4899', // Pink
    '#14B8A6', // Teal
]

export default function NewSubjectPage() {
    const router = useRouter()
    const { addSubject } = useSubjectStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedIcon, setSelectedIcon] = useState('')
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SubjectFormData>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            color: COLOR_OPTIONS[0],
        },
    })

    const onSubmit: SubmitHandler<SubjectFormData> = async (data) => {
        setIsSubmitting(true)

        await new Promise(resolve => setTimeout(resolve, 500))

        const newSubject = {
            id: `subject-${Date.now()}`,
            name: data.name,
            description: data.description || '',
            icon: selectedIcon || undefined,
            color: selectedColor,
            topics: [],
        }

        addSubject(newSubject)
        router.push('/teacher/subjects')
    }

    return (
        <DashboardLayout
            role="teacher"
            title="Create Subject"
            subtitle="Add a new subject to organize your content"
        >
            <div className="mb-4">
                <Link href="/teacher/subjects">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Subjects
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Subject Information</CardTitle>
                        <CardDescription>
                            Provide the basic details for your subject
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Subject Name *</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                placeholder="e.g., Mathematics"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                {...register('description')}
                                placeholder="Brief description of the subject..."
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Icon Picker */}
                        <div className="space-y-2">
                            <Label>Icon (Optional)</Label>
                            <div className="flex gap-2 flex-wrap">
                                {ICON_OPTIONS.map(icon => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setSelectedIcon(icon)}
                                        className={`h-12 w-12 rounded-lg border-2 text-2xl transition-all hover:scale-110 ${selectedIcon === icon
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border'
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex gap-2 flex-wrap">
                                {COLOR_OPTIONS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${selectedColor === color
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-border'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Creating...' : 'Create Subject'}
                    </Button>
                </div>
            </form>
        </DashboardLayout>
    )
}
